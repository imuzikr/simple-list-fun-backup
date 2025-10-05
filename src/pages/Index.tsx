import { useState } from "react";
import { Check, Plus, Trash2, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const addTodo = () => {
    if (!inputValue.trim()) {
      toast.error("할 일을 입력해주세요");
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      createdAt: new Date(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    toast.success("할 일이 추가되었습니다");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("할 일이 삭제되었습니다");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="mx-auto max-w-2xl">
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
