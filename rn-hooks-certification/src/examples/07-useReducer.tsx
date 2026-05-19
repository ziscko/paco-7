/**
 * ============================================
 * TEMA 7: Reducción con useReducer
 * ============================================
 *
 * useReducer es una alternativa a useState para lógicas de estado
 * complejas con múltiples sub-valores.
 *
 * Sintaxis: const [state, dispatch] = useReducer(reducer, initialState);
 *
 * Cuándo usar useReducer vs useState:
 * - useState: estado simple (boolean, string, number)
 * - useReducer: estado complejo con múltiples acciones relacionadas
 *
 * Patrón similar a Redux: (state, action) => newState
 */

import { useReducer, useState } from "react";

// ─── Ejemplo 1: Contador con useReducer ───────────────────────

type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET"; payload: number };

interface CounterState {
  count: number;
  history: number[];
}

function counterReducer(
  state: CounterState,
  action: CounterAction,
): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    case "DECREMENT":
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1],
      };
    case "RESET":
      return { count: 0, history: [] };
    case "SET":
      return {
        count: action.payload,
        history: [...state.history, action.payload],
      };
    default:
      return state;
  }
}

function ContadorReducer() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [],
  });

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Contador con useReducer</h3>
      <p style={{ fontSize: "1.5rem" }}>
        Count: <strong>{state.count}</strong>
      </p>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>{" "}
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>{" "}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>{" "}
      <button onClick={() => dispatch({ type: "SET", payload: 100 })}>
        Set 100
      </button>
      <p style={{ fontSize: "0.85rem", color: "#888" }}>
        Historial: [{state.history.slice(-5).join(", ")}]
      </p>
      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`const [state, dispatch] = useReducer(reducer, initial);

dispatch({ type: "INCREMENT" });
dispatch({ type: "SET", payload: 100 });`}
      </pre>
    </div>
  );
}

// ─── Ejemplo 2: Formulario complejo ──────────────────────────

interface FormState {
  username: string;
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

type FormAction =
  | { type: "FIELD_CHANGE"; field: string; value: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "RESET" };

const initialFormState: FormState = {
  username: "",
  email: "",
  password: "",
  isSubmitting: false,
  error: null,
  success: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "FIELD_CHANGE":
      return { ...state, [action.field]: action.value, error: null };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: null };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false, success: true };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, error: action.error };
    case "RESET":
      return initialFormState;
    default:
      return state;
  }
}

function FormularioReducer() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_START" });

    // Simulamos una llamada async
    setTimeout(() => {
      if (state.email.includes("@")) {
        dispatch({ type: "SUBMIT_SUCCESS" });
      } else {
        dispatch({ type: "SUBMIT_ERROR", error: "Email inválido" });
      }
    }, 1000);
  };

  if (state.success) {
    return (
      <div
        style={{
          padding: "1rem",
          border: "1px solid #4caf50",
          borderRadius: 8,
        }}
      >
        <h3>✅ Formulario enviado</h3>
        <p>Usuario: {state.username}</p>
        <button onClick={() => dispatch({ type: "RESET" })}>
          Nuevo formulario
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Formulario con useReducer</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.5rem" }}>
          <input
            placeholder="Username"
            value={state.username}
            onChange={(e) =>
              dispatch({
                type: "FIELD_CHANGE",
                field: "username",
                value: e.target.value,
              })
            }
            style={{ padding: "0.5rem", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <input
            placeholder="Email"
            value={state.email}
            onChange={(e) =>
              dispatch({
                type: "FIELD_CHANGE",
                field: "email",
                value: e.target.value,
              })
            }
            style={{ padding: "0.5rem", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={state.password}
            onChange={(e) =>
              dispatch({
                type: "FIELD_CHANGE",
                field: "password",
                value: e.target.value,
              })
            }
            style={{ padding: "0.5rem", width: "100%" }}
          />
        </div>
        {state.error && <p style={{ color: "#f44336" }}>❌ {state.error}</p>}
        <button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting ? "Enviando..." : "Enviar"}
        </button>{" "}
        <button type="button" onClick={() => dispatch({ type: "RESET" })}>
          Reset
        </button>
      </form>
    </div>
  );
}

// ─── Ejemplo 3: Todo List (patrón clásico) ───────────────────

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type TodoAction =
  | { type: "ADD"; text: string }
  | { type: "TOGGLE"; id: number }
  | { type: "DELETE"; id: number }
  | { type: "CLEAR_COMPLETED" };

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: Date.now(), text: action.text, completed: false },
      ];
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      );
    case "DELETE":
      return state.filter((todo) => todo.id !== action.id);
    case "CLEAR_COMPLETED":
      return state.filter((todo) => !todo.completed);
    default:
      return state;
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: "Aprender useReducer", completed: true },
    { id: 2, text: "Practicar con ejemplos", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const handleAdd = () => {
    if (newTodo.trim()) {
      dispatch({ type: "ADD", text: newTodo.trim() });
      setNewTodo("");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Todo List con useReducer</h3>

      <div style={{ marginBottom: "0.5rem" }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Nueva tarea..."
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={handleAdd}>Agregar</button>{" "}
        <button onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}>
          Limpiar completados
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ padding: "0.25rem 0" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: "TOGGLE", id: todo.id })}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                marginLeft: "0.5rem",
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => dispatch({ type: "DELETE", id: todo.id })}
              style={{ marginLeft: "0.5rem", color: "red" }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Componente principal del tema
export default function UseReducerDemo() {
  return (
    <div>
      <h2>Tema 7: Reducción con useReducer</h2>
      <p>
        Alternativa a useState para lógicas de estado complejas con múltiples
        sub-valores.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ContadorReducer />
        <FormularioReducer />
        <TodoList />
      </div>
    </div>
  );
}
