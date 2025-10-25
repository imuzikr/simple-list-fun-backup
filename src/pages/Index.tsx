import { useState, useEffect } from "react";
import { Check, Plus, Trash2, ListTodo, Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Todo as DbTodo } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const { user, signOut } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  // Load todos from Supabase on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos: Todo[] = (data || []).map((todo: DbTodo) => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        createdAt: new Date(todo.created_at),
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error("할 일을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!inputValue.trim()) {
      toast.error("할 일을 입력해주세요");
      return;
    }

    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text: inputValue, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const newTodo: Todo = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        createdAt: new Date(data.created_at),
      };

      setTodos([newTodo, ...todos]);
      setInputValue("");
      toast.success("할 일이 추가되었습니다");
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error("할 일 추가에 실패했습니다");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("로그아웃되었습니다");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("로그아웃에 실패했습니다");
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error("할 일 상태 변경에 실패했습니다");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("할 일이 삭제되었습니다");
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error("할 일 삭제에 실패했습니다");
    }
  };

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('todos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos'
        },
        (payload) => {
          console.log('Realtime change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newTodo: Todo = {
              id: payload.new.id,
              text: payload.new.text,
              completed: payload.new.completed,
              createdAt: new Date(payload.new.created_at),
            };
            setTodos((prev) => {
              // Avoid duplicates
              if (prev.some(t => t.id === newTodo.id)) return prev;
              return [newTodo, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setTodos((prev) =>
              prev.map((todo) =>
                todo.id === payload.new.id
                  ? {
                      ...todo,
                      text: payload.new.text,
                      completed: payload.new.completed,
                    }
                  : todo
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setTodos((prev) => prev.filter((todo) => todo.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-subtle py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* User Profile Header */}
        <div className="mb-4 flex justify-end animate-fade-in">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {user?.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Header */}
        <header className="mb-8 text-center animate-fade-in">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-card">
            <ListTodo className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            할 일 관리
          </h1>
          <p className="text-muted-foreground">
            오늘 해야 할 일을 정리하고 관리하세요
          </p>
        </header>

        {/* Input Section */}
        <section className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-card rounded-2xl shadow-card p-4 transition-all duration-300 hover:shadow-hover">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="새로운 할 일을 입력하세요..."
                className="flex-1 border-input focus-visible:ring-primary"
              />
              <Button
                onClick={addTodo}
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-card"
              >
                <Plus className="w-5 h-5 mr-2" />
                추가
              </Button>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between bg-card rounded-2xl shadow-card p-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-gradient-primary" : ""}
                size="sm"
              >
                전체 ({todos.length})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                onClick={() => setFilter("active")}
                className={filter === "active" ? "bg-gradient-primary" : ""}
                size="sm"
              >
                활성 ({activeCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                onClick={() => setFilter("completed")}
                className={filter === "completed" ? "bg-gradient-primary" : ""}
                size="sm"
              >
                완료 ({completedCount})
              </Button>
            </div>
          </div>
        </section>

        {/* Todos List */}
        <section className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-card rounded-2xl shadow-card p-12 text-center animate-fade-in">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Check className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {filter === "completed"
                  ? "완료된 할 일이 없습니다"
                  : filter === "active"
                  ? "모든 할 일을 완료했습니다! 🎉"
                  : "할 일을 추가해보세요"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="bg-card rounded-2xl shadow-card p-4 transition-all duration-300 hover:shadow-hover animate-slide-in group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="data-[state=checked]:bg-gradient-primary data-[state=checked]:border-primary"
                  />
                  <span
                    className={`flex-1 transition-all duration-300 ${
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <footer className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
            총 {todos.length}개의 할 일 중 {completedCount}개 완료
          </footer>
        )}
      </div>
    </main>
  );
};

export default Index;
