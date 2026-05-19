/**
 * ============================================
 * TEMA 9: Tips de Certificación
 * ============================================
 *
 * Errores comunes y buenas prácticas para la certificación:
 *
 * ⭐ Stale Closures: Siempre revisa que las dependencias en useEffect estén actualizadas.
 * ⭐ Lazy Initial State: Pasa una función a useState si el valor inicial es pesado de calcular.
 * ⭐ Infinite Loops: Evita actualizar un estado que sea a la vez dependencia del mismo useEffect.
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Problema 1: Stale Closures ──────────────────────────────

function StaleClosureDemo() {
  const [count, setCount] = useState(0);
  const [staleValue, setStaleValue] = useState(0);
  const [freshValue, setFreshValue] = useState(0);

  // ❌ STALE CLOSURE: count se "congela" en el valor del primer render
  useEffect(() => {
    const interval = setInterval(() => {
      // Este 'count' siempre será 0 (valor capturado en el closure)
      setStaleValue(count); // ❌ Siempre será el valor inicial
    }, 1000);
    return () => clearInterval(interval);
  }, []); // ← count NO está en las dependencias

  // ✅ SOLUCIÓN 1: Incluir la dependencia
  useEffect(() => {
    const interval = setInterval(() => {
      setFreshValue(count); // ✅ Se actualiza cuando count cambia
    }, 1000);
    return () => clearInterval(interval);
  }, [count]); // ← count está en las dependencias

  // ✅ SOLUCIÓN 2: Usar actualización funcional
  // setCount(prev => prev + 1); // No necesita count en deps

  return (
    <div
      style={{ padding: "1rem", border: "1px solid #f44336", borderRadius: 8 }}
    >
      <h3>⭐ Stale Closures</h3>
      <p>
        Count real: <strong>{count}</strong>
      </p>
      <p>
        ❌ Valor stale (sin dep):{" "}
        <strong style={{ color: "#f44336" }}>{staleValue}</strong>
      </p>
      <p>
        ✅ Valor fresh (con dep):{" "}
        <strong style={{ color: "#4caf50" }}>{freshValue}</strong>
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
        {`// ❌ Stale closure
useEffect(() => {
  setInterval(() => {
    console.log(count); // Siempre 0!
  }, 1000);
}, []); // count no está en deps

// ✅ Solución: agregar dependencia
useEffect(() => { ... }, [count]);

// ✅ Solución: actualización funcional
setCount(prev => prev + 1); // No necesita count`}
      </pre>
    </div>
  );
}

// ─── Problema 2: Lazy Initial State ──────────────────────────

function LazyInitialStateDemo() {
  // ❌ INCORRECTO: La función se ejecuta en CADA render
  // const [data] = useState(expensiveComputation());

  // ✅ CORRECTO: La función solo se ejecuta en el PRIMER render
  const [data] = useState(() => {
    console.log("⚡ Cálculo costoso (solo 1 vez)");
    // Simular cálculo pesado
    return Array.from({ length: 1000 }, (_, i) => i * i).reduce(
      (a, b) => a + b,
      0,
    );
  });

  const [trigger, setTrigger] = useState(0);

  return (
    <div
      style={{ padding: "1rem", border: "1px solid #ff9800", borderRadius: 8 }}
    >
      <h3>⭐ Lazy Initial State</h3>
      <p>
        Resultado del cálculo: <strong>{data.toLocaleString()}</strong>
      </p>
      <p>Re-renders: {trigger} (el cálculo NO se repite)</p>
      <button onClick={() => setTrigger((t) => t + 1)}>Forzar re-render</button>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// ❌ Se ejecuta en CADA render
const [data] = useState(expensiveComputation());

// ✅ Se ejecuta solo en el PRIMER render (lazy)
const [data] = useState(() => expensiveComputation());

// La diferencia es pasar una FUNCIÓN vs el RESULTADO`}
      </pre>
    </div>
  );
}

// ─── Problema 3: Infinite Loops ──────────────────────────────

function InfiniteLoopDemo() {
  const [count, setCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);
  const renderRef = useRef(0);

  // ❌ INFINITE LOOP (comentado para no romper la app):
  // useEffect(() => {
  //   setCount(count + 1); // Actualiza count → dispara useEffect → loop infinito
  // }, [count]); // count es dependencia Y se actualiza dentro

  // ✅ SOLUCIÓN: Usar una condición de salida o separar la lógica
  useEffect(() => {
    if (safeCount < 5) {
      const timer = setTimeout(() => {
        setSafeCount((c) => c + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [safeCount]);

  renderRef.current += 1;

  // ✅ SOLUCIÓN: Usar useRef para evitar dependencias
  const countRef = useRef(count);
  countRef.current = count;

  const logCount = useCallback(() => {
    // Accede al valor actual sin ser dependencia
    console.log("Count actual:", countRef.current);
  }, []); // Sin dependencias gracias a useRef

  return (
    <div
      style={{ padding: "1rem", border: "1px solid #9c27b0", borderRadius: 8 }}
    >
      <h3>⭐ Infinite Loops</h3>
      <p>
        Safe count (se detiene en 5): <strong>{safeCount}</strong>
      </p>
      <p>Renders: {renderRef.current}</p>
      <button
        onClick={() => {
          setCount((c) => c + 1);
          logCount();
        }}
      >
        Incrementar ({count})
      </button>
      <button onClick={() => setSafeCount(0)}>Reset safe count</button>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// ❌ INFINITE LOOP
useEffect(() => {
  setCount(count + 1); // Actualiza la misma dependencia
}, [count]); // ← count cambia → efecto se ejecuta → loop

// ✅ Soluciones:
// 1. Condición de salida
useEffect(() => {
  if (count < MAX) setCount(c => c + 1);
}, [count]);

// 2. Separar en diferentes estados
// 3. Usar useRef para valores que no deben disparar efectos`}
      </pre>
    </div>
  );
}

// ─── Resumen de Tips ─────────────────────────────────────────

function ResumenTips() {
  return (
    <div
      style={{ padding: "1rem", border: "1px solid #4fc3f7", borderRadius: 8 }}
    >
      <h3>📋 Resumen para la Certificación</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "1px solid #555",
              }}
            >
              Problema
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "1px solid #555",
              }}
            >
              Causa
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "1px solid #555",
              }}
            >
              Solución
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.5rem" }}>Stale Closure</td>
            <td style={{ padding: "0.5rem" }}>
              Dependencia faltante en useEffect
            </td>
            <td style={{ padding: "0.5rem" }}>
              Agregar deps o usar actualización funcional
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem" }}>Rendimiento</td>
            <td style={{ padding: "0.5rem" }}>
              Cálculo costoso en cada render
            </td>
            <td style={{ padding: "0.5rem" }}>Lazy initial state o useMemo</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem" }}>Infinite Loop</td>
            <td style={{ padding: "0.5rem" }}>
              Actualizar estado que es dependencia
            </td>
            <td style={{ padding: "0.5rem" }}>
              Condición de salida, useRef, separar estados
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Componente principal del tema
export default function TipsCertificacion() {
  return (
    <div>
      <h2>Tema 9: Tips de Certificación</h2>
      <p>Errores comunes y cómo evitarlos en el examen.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <StaleClosureDemo />
        <LazyInitialStateDemo />
        <InfiniteLoopDemo />
        <ResumenTips />
      </div>
    </div>
  );
}
