/**
 * ============================================
 * TEMA 4: Optimización de Rendimiento
 *         useMemo y useCallback
 * ============================================
 *
 * useMemo: Memoriza el RESULTADO de cálculos costosos.
 *          Solo recalcula cuando cambian las dependencias.
 *          C = f(x, y) → se cachea el resultado.
 *
 * useCallback: Memoriza la DEFINICIÓN de la función para evitar
 *              re-renders en componentes hijos.
 *              Útil con React.memo() en componentes hijos.
 */

import { useState, useMemo, useCallback, memo } from "react";

// ─── useMemo: Memorizar resultados costosos ───────────────────

function UseMemoDemo() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Simulamos un cálculo costoso
  const expensiveCalculation = useMemo(() => {
    console.log("🧮 Calculando... (solo cuando count cambia)");
    let result = 0;
    for (let i = 0; i < count * 1000; i++) {
      result += Math.sqrt(i);
    }
    return result.toFixed(2);
  }, [count]); // Solo recalcula si count cambia

  // Sin useMemo, este cálculo se ejecutaría en CADA render
  // (incluso al cambiar darkMode)

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #555",
        borderRadius: 8,
        background: darkMode ? "#1a1a2e" : "#f0f0f0",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <h3>useMemo - Memoriza el resultado</h3>
      <p>Count: {count}</p>
      <p>Resultado costoso: {expensiveCalculation}</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Incrementar count
      </button>{" "}
      <button onClick={() => setDarkMode((d) => !d)}>
        Toggle Dark Mode (no recalcula)
      </button>
      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// useMemo memoriza el RESULTADO
const resultado = useMemo(() => {
  return calculoCostoso(x, y);
}, [x, y]); // Solo recalcula si x o y cambian`}
      </pre>
    </div>
  );
}

// ─── useCallback: Memorizar definiciones de funciones ─────────

// Componente hijo envuelto en memo (solo re-renderiza si sus props cambian)
const BotonContador = memo(function BotonContador({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  console.log(`🔄 Renderizando botón: ${label}`);
  return (
    <button onClick={onClick} style={{ margin: "0.25rem" }}>
      {label}
    </button>
  );
});

function UseCallbackDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  // ✅ useCallback memoriza la REFERENCIA de la función
  // Sin useCallback, cada render crea una nueva función → re-render del hijo
  const incrementA = useCallback(() => {
    setCountA((prev) => prev + 1);
  }, []); // No tiene dependencias externas

  const incrementB = useCallback(() => {
    setCountB((prev) => prev + 1);
  }, []);

  // ❌ Sin useCallback: esta función se recrea en cada render
  // const incrementA = () => setCountA(prev => prev + 1);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>useCallback - Memoriza la definición de la función</h3>
      <p>
        Count A: <strong>{countA}</strong> | Count B: <strong>{countB}</strong>
      </p>
      <p style={{ fontSize: "0.85rem", color: "#888" }}>
        Abre la consola: solo se re-renderiza el botón que cambia.
      </p>

      <BotonContador onClick={incrementA} label="Incrementar A" />
      <BotonContador onClick={incrementB} label="Incrementar B" />

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// useCallback memoriza la DEFINICIÓN
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // La función no se recrea entre renders

// Combinado con React.memo en el hijo:
const Child = memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});`}
      </pre>
    </div>
  );
}

// ─── Comparación lado a lado ──────────────────────────────────

function Comparacion() {
  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Comparación: useMemo vs useCallback</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #555",
                padding: "0.5rem",
              }}
            >
              Hook
            </th>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #555",
                padding: "0.5rem",
              }}
            >
              Memoriza
            </th>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #555",
                padding: "0.5rem",
              }}
            >
              Uso típico
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.5rem" }}>
              <code>useMemo</code>
            </td>
            <td style={{ padding: "0.5rem" }}>
              El <strong>resultado</strong> de una función
            </td>
            <td style={{ padding: "0.5rem" }}>
              Cálculos costosos, filtros, transformaciones
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem" }}>
              <code>useCallback</code>
            </td>
            <td style={{ padding: "0.5rem" }}>
              La <strong>definición</strong> de la función
            </td>
            <td style={{ padding: "0.5rem" }}>
              Callbacks pasados a hijos con React.memo
            </td>
          </tr>
        </tbody>
      </table>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// Son equivalentes:
useCallback(fn, deps)
useMemo(() => fn, deps)`}
      </pre>
    </div>
  );
}

// Componente principal del tema
export default function OptimizacionRendimiento() {
  return (
    <div>
      <h2>Tema 4: Optimización de Rendimiento</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <UseMemoDemo />
        <UseCallbackDemo />
        <Comparacion />
      </div>
    </div>
  );
}
