/**
 * ============================================
 * TEMA 5: Acceso Directo y Referencias con useRef
 * ============================================
 *
 * useRef devuelve un objeto de referencia mutable que persiste
 * durante todo el ciclo de vida del componente.
 *
 * Usos principales:
 * ✅ Acceso a nodos nativos (TextInput, DOM elements)
 * ✅ Almacena valores sin disparar render
 * ✅ Persistencia de variables mutables (timers, previous values)
 *
 * Diferencia clave con useState:
 * - useState: cambiar el valor causa re-render
 * - useRef: cambiar .current NO causa re-render
 */

import { useState, useRef, useEffect } from "react";

// Ejemplo 1: Acceso a nodos del DOM (equivalente a TextInput en RN)
function AccesoDOM() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  const focusInput = () => {
    // Acceso directo al nodo DOM
    inputRef.current?.focus();
  };

  const clearAndFocus = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>✅ Acceso a nodos del DOM</h3>
      <p>En React Native sería acceso a TextInput, ScrollView, etc.</p>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribe algo..."
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={focusInput}>Focus</button>{" "}
      <button onClick={clearAndFocus}>Clear & Focus</button>
      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`const inputRef = useRef<HTMLInputElement>(null);

// En React Native:
// const inputRef = useRef<TextInput>(null);

// Acceso directo al nodo
inputRef.current?.focus();`}
      </pre>
    </div>
  );
}

// Ejemplo 2: Almacenar valores sin disparar render
function ValorSinRender() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  const previousCount = useRef(0);

  // Esto NO causa re-render (a diferencia de useState)
  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    previousCount.current = count;
  }, [count]);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>✅ Almacena valores sin disparar render</h3>

      <p>
        Count actual: <strong>{count}</strong>
      </p>
      <p>
        Count anterior: <strong>{previousCount.current}</strong>
      </p>
      <p>
        Número de renders: <strong>{renderCount.current}</strong>
      </p>

      <button onClick={() => setCount((c) => c + 1)}>Incrementar</button>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`const renderCount = useRef(0);

// Cambiar .current NO causa re-render
renderCount.current += 1;

// Útil para guardar valores previos
const previousValue = useRef(currentValue);
useEffect(() => {
  previousValue.current = currentValue;
}, [currentValue]);`}
      </pre>
    </div>
  );
}

// Ejemplo 3: Persistencia de variables mutables (timers)
function TimerConRef() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>✅ Persistencia de variables mutables (Timer)</h3>
      <p style={{ fontSize: "2rem", fontFamily: "monospace" }}>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </p>
      <button onClick={start} disabled={isRunning}>
        ▶️ Start
      </button>{" "}
      <button onClick={stop} disabled={!isRunning}>
        ⏸ Stop
      </button>{" "}
      <button onClick={reset}>🔄 Reset</button>
      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// Guardar referencia al interval para poder limpiarlo
const intervalRef = useRef<NodeJS.Timeout | null>(null);

intervalRef.current = setInterval(() => { ... }, 1000);

// Limpiar cuando sea necesario
clearInterval(intervalRef.current);`}
      </pre>
    </div>
  );
}

// Componente principal del tema
export default function UseRefDemo() {
  return (
    <div>
      <h2>Tema 5: Acceso Directo y Referencias con useRef</h2>
      <p>
        Devuelve un objeto de referencia mutable que persiste durante el ciclo
        de vida.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <AccesoDOM />
        <ValorSinRender />
        <TimerConRef />
      </div>
    </div>
  );
}
