/**
 * ============================================
 * TEMA 8: Custom Hooks y Reusabilidad
 * ============================================
 *
 * Los Custom Hooks permiten:
 * - Abstracción: Extraer lógica a funciones "useX"
 * - Clean Code: Componentes UI más delgados
 * - Reusabilidad: Compartir lógica entre componentes
 *
 * Reglas:
 * - El nombre DEBE empezar con "use" (convención + linter)
 * - Pueden usar otros hooks internamente
 * - Retornan lo que necesite el componente
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Custom Hook 1: useToggle ─────────────────────────────────

function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// ─── Custom Hook 2: useLocalStorage ───────────────────────────

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// ─── Custom Hook 3: useFetch ──────────────────────────────────

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ─── Custom Hook 4: useDebounce ───────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── Custom Hook 5: useCounter ────────────────────────────────

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + step), [step]);
  const decrement = useCallback(() => setCount((c) => c - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

// ─── Custom Hook 6: usePrevious ───────────────────────────────

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ─── Demos de uso ─────────────────────────────────────────────

function ToggleDemo() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>useToggle</h3>
      <p>
        Estado: <strong>{isOpen ? "Abierto" : "Cerrado"}</strong>
      </p>
      <button onClick={toggle}>Toggle</button>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// Uso:
const [isOpen, toggle] = useToggle(false);`}
      </pre>
    </div>
  );
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage("user-name", "");

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>useLocalStorage</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre (persiste en localStorage)"
        style={{ padding: "0.5rem", width: "100%" }}
      />
      <p>
        Valor guardado: <strong>{name || "(vacío)"}</strong>
      </p>
      <p style={{ fontSize: "0.8rem", color: "#888" }}>
        Recarga la página y el valor persiste.
      </p>
    </div>
  );
}

function FetchDemo() {
  const { data, loading, error, refetch } = useFetch<{ title: string }>(
    "https://jsonplaceholder.typicode.com/todos/1",
  );

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>useFetch</h3>
      {loading && <p>⏳ Cargando...</p>}
      {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}
      {data && <p>✅ Título: {data.title}</p>}
      <button onClick={refetch}>Refetch</button>
    </div>
  );
}

function DebounceDemo() {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>useDebounce</h3>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe rápido..."
        style={{ padding: "0.5rem", width: "100%" }}
      />
      <p>Valor actual: {text}</p>
      <p>
        Valor debounced (500ms): <strong>{debouncedText}</strong>
      </p>
    </div>
  );
}

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0, 5);
  const previousCount = usePrevious(count);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>useCounter + usePrevious</h3>
      <p>
        Count: <strong>{count}</strong> (anterior: {previousCount ?? "N/A"})
      </p>
      <button onClick={decrement}>-5</button>{" "}
      <button onClick={reset}>Reset</button>{" "}
      <button onClick={increment}>+5</button>
    </div>
  );
}

// Componente principal del tema
export default function CustomHooksDemo() {
  return (
    <div>
      <h2>Tema 8: Custom Hooks y Reusabilidad</h2>
      <p>Extrae lógica a funciones "useX" para componentes UI más delgados.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ToggleDemo />
        <LocalStorageDemo />
        <FetchDemo />
        <DebounceDemo />
        <CounterDemo />
      </div>
    </div>
  );
}
