/**
 * ============================================
 * TEMA 9: Tips de Certificación
 * ============================================
 *
 * ⭐ Stale Closures: Siempre revisa que las dependencias en useEffect estén actualizadas.
 * ⭐ Lazy Initial State: Pasa una función a useState si el valor inicial es pesado de calcular.
 * ⭐ Infinite Loops: Evita actualizar un estado que sea a la vez dependencia del mismo useEffect.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

function StaleClosureDemo() {
  const [count, setCount] = useState(0)
  const [staleValue, setStaleValue] = useState(0)
  const [freshValue, setFreshValue] = useState(0)

  // ❌ STALE CLOSURE: count se "congela" en el valor del primer render
  useEffect(() => {
    const interval = setInterval(() => {
      setStaleValue(count) // ❌ Siempre será el valor inicial
    }, 1000)
    return () => clearInterval(interval)
  }, []) // ← count NO está en las dependencias

  // ✅ SOLUCIÓN: Incluir la dependencia
  useEffect(() => {
    const interval = setInterval(() => {
      setFreshValue(count) // ✅ Se actualiza cuando count cambia
    }, 1000)
    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="example-card example-card--danger">
      <h3>⭐ Stale Closures</h3>
      <p>
        Count real: <strong>{count}</strong>
      </p>
      <p>
        ❌ Valor stale (sin dep): <strong className="text-danger">{staleValue}</strong>
      </p>
      <p>
        ✅ Valor fresh (con dep): <strong className="text-success">{freshValue}</strong>
      </p>
      <button className="btn btn-outline-light btn-sm" onClick={() => setCount((c) => c + 1)}>
        Incrementar
      </button>

      <pre className="code-block mt-3">
        {`// ❌ Stale closure
useEffect(() => {
  setInterval(() => {
    console.log(count) // Siempre 0!
  }, 1000)
}, []) // count no está en deps

// ✅ Solución: agregar dependencia
useEffect(() => { ... }, [count])

// ✅ Solución: actualización funcional
setCount(prev => prev + 1) // No necesita count`}
      </pre>
    </div>
  )
}

function LazyInitialStateDemo() {
  const [data] = useState(() => {
    console.log('⚡ Cálculo costoso (solo 1 vez)')
    return Array.from({ length: 1000 }, (_, i) => i * i).reduce((a, b) => a + b, 0)
  })

  const [trigger, setTrigger] = useState(0)

  return (
    <div className="example-card example-card--warning">
      <h3>⭐ Lazy Initial State</h3>
      <p>
        Resultado del cálculo: <strong>{data.toLocaleString()}</strong>
      </p>
      <p>Re-renders: {trigger} (el cálculo NO se repite)</p>
      <button className="btn btn-outline-light btn-sm" onClick={() => setTrigger((t) => t + 1)}>
        Forzar re-render
      </button>

      <pre className="code-block mt-3">
        {`// ❌ Se ejecuta en CADA render
const [data] = useState(expensiveComputation())

// ✅ Se ejecuta solo en el PRIMER render (lazy)
const [data] = useState(() => expensiveComputation())

// La diferencia es pasar una FUNCIÓN vs el RESULTADO`}
      </pre>
    </div>
  )
}

function InfiniteLoopDemo() {
  const [count, setCount] = useState(0)
  const [safeCount, setSafeCount] = useState(0)
  const renderRef = useRef(0)

  useEffect(() => {
    if (safeCount < 5) {
      const timer = setTimeout(() => {
        setSafeCount((c) => c + 1)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [safeCount])

  renderRef.current += 1

  const countRef = useRef(count)
  countRef.current = count

  const logCount = useCallback(() => {
    console.log('Count actual:', countRef.current)
  }, [])

  return (
    <div className="example-card example-card--purple">
      <h3>⭐ Infinite Loops</h3>
      <p>
        Safe count (se detiene en 5): <strong>{safeCount}</strong>
      </p>
      <p>Renders: {renderRef.current}</p>
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => {
            setCount((c) => c + 1)
            logCount()
          }}
        >
          Incrementar ({count})
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setSafeCount(0)}>
          Reset safe count
        </button>
      </div>

      <pre className="code-block mt-3">
        {`// ❌ INFINITE LOOP
useEffect(() => {
  setCount(count + 1) // Actualiza la misma dependencia
}, [count]) // ← count cambia → efecto se ejecuta → loop

// ✅ Soluciones:
// 1. Condición de salida
useEffect(() => {
  if (count < MAX) setCount(c => c + 1)
}, [count])

// 2. Separar en diferentes estados
// 3. Usar useRef para valores que no deben disparar efectos`}
      </pre>
    </div>
  )
}

function ResumenTips() {
  return (
    <div className="example-card example-card--accent">
      <h3>📋 Resumen para la Certificación</h3>
      <div className="table-responsive">
        <table className="table table-dark table-bordered">
          <thead>
            <tr className="table-info">
              <th>Problema</th>
              <th>Causa</th>
              <th>Solución</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stale Closure</td>
              <td>Dependencia faltante en useEffect</td>
              <td>Agregar deps o usar actualización funcional</td>
            </tr>
            <tr>
              <td>Rendimiento</td>
              <td>Cálculo costoso en cada render</td>
              <td>Lazy initial state o useMemo</td>
            </tr>
            <tr>
              <td>Infinite Loop</td>
              <td>Actualizar estado que es dependencia</td>
              <td>Condición de salida, useRef, separar estados</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function TipsCertificacion() {
  return (
    <div>
      <h2 className="mb-4">Tema 9: Tips de Certificación</h2>
      <p className="mb-4">Errores comunes y cómo evitarlos en el examen.</p>

      <div className="d-flex flex-column gap-3">
        <StaleClosureDemo />
        <LazyInitialStateDemo />
        <InfiniteLoopDemo />
        <ResumenTips />
      </div>
    </div>
  )
}
