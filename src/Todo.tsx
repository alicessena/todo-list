import { useEffect, useState } from "react";
import { Trash2, Edit3, Check, ListTodo, Sun, Moon } from "lucide-react";
import "./style.css";

interface Todo {
  id: number;
  title: string;
  checked: boolean;
}

type FilterType = "all" | "pending" | "completed";

export function Todo() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [todoInput, setTodoInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const addTodo = () => {
    if (todoInput.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title: todoInput,
          checked: false,
        },
      ]);
      setTodoInput("");
      showNotification("Tarefa adicionada!");
    }
  };

  const toggleCheck = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showNotification("Tarefa removida!");
  };

  const startEditing = (id: number, title: string) => {
    setEditingId(id);
    setEditingText(title);
  };

  const saveEditing = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: editingText } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
    showNotification("Tarefa editada!");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "pending") return !todo.checked;
    if (filter === "completed") return todo.checked;
    return true;
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      theme === "light" ? "dark" : "light"
    );
  };

  return (
    <div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? <Sun /> : <Moon />}
      </button>
      <section className="container">
        <header>
          <span className="svg">
            <ListTodo size={"32px"} />
          </span>
          <h1>TO-DO LIST</h1>
        </header>
        <div className="up">
          <input
            type="text"
            placeholder="Adicione uma nova tarefa..."
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="add" onClick={addTodo}>
            Adicionar
          </button>

          <div className="filters">
            <button className="btn" onClick={() => setFilter("all")}>
              Todas
            </button>
            <button className="btn" onClick={() => setFilter("pending")}>
              A Fazer
            </button>
            <button className="btn" onClick={() => setFilter("completed")}>
              Concluídas
            </button>
          </div>
        </div>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.checked ? "completed" : ""}>
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={() => toggleCheck(todo.id)}
              />

              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
              ) : (
                <span>{todo.title}</span>
              )}

              <div className="svg">
                {editingId === todo.id ? (
                  <button className="svg" onClick={() => saveEditing(todo.id)}>
                    <Check />
                  </button>
                ) : (
                  <button
                    className="svg"
                    onClick={() => startEditing(todo.id, todo.title)}
                  >
                    <Edit3 />
                  </button>
                )}
                <button className="svg" onClick={() => removeTodo(todo.id)}>
                  <Trash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}
