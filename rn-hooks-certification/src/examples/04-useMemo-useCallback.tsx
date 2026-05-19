/**
 * ============================================
 * TEMA 4: Optimización de Rendimiento
 *         useMemo y useCallback
 * ============================================
 *
 * useMemo: Memoriza el RESULTADO de cálculos costosos.
 * useCallback: Memoriza la DEFINICIÓN de la función para evitar
 *              re-renders en componentes hijos.
 */

import { useState, useMemo, useCallback, memo } from 'react'

function UseMemoDemo() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  const expensiveCalculation = useMemo(() => {
    console.log('🧮 Calculando... (solo cuando count cambia)')
    let result = 0
    for (let i = 0; i < count * 1000; i++) {
      result += Math.sqrt(i)
    }
    return result.toFixed(2)
  }, [count])

  return (
    <div className={`example-card ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <h3>1. useMemo - Memoriza el resultado</h3>
      <p>Count: {count}</p>
      <p>Resultado costoso: {expensiveCalculation}</p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary btn-sm" onClick={() => setCount((c) => c + 1)}>
          Incrementar count
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setDarkMode((d) => !d)}>
          Toggle Dark Mode (no recalcula)
        </button>
      </div>

      <pre className="code-block mt-3">
        {`// useMemo memoriza el RESULTADO
const resultado = useMemo(() => {
  return calculoCostoso(x, y)
}, [x, y]) // Solo recalcula si x o y cambian`}
      </pre>
    </div>
  )
}

const BotonContador = memo(function BotonContador({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  console.log(`🔄 Renderizando botón: ${label}`)
  return (
    <button className="btn btn-outline-info btn-sm" onClick={onClick}>
      {label}
    </button>
  )
})

function UseCallbackDemo() {
  const [countA, setCountA] = useState(0)
  const [countB, setCountB] = useState(0)

  const incrementA = useCallback(() => {
    setCountA((prev) => prev + 1)
  }, [])

  const incrementB = useCallback(() => {
    setCountB((prev) => prev + 1)
  }, [])

  return (
    <div className="example-card">
      <h3>2. useCallback - Memoriza la definición de la función</h3>
      <p>
        Count A: <strong>{countA}</strong> | Count B: <strong>{countB}</strong>
      </p>
      <p className="text-muted small">Abre la consola: solo se re-renderiza el botón que cambia.</p>

      <div className="d-flex gap-2">
        <BotonContador onClick={incrementA} label="Incrementar A" />
        <BotonContador onClick={incrementB} label="Incrementar B" />
      </div>

      <pre className="code-block mt-3">
        {`// useCallback memoriza la DEFINICIÓN
const handleClick = useCallback(() => {
  setCount(prev => prev + 1)
}, []) // La función no se recrea entre renders

// Combinado con React.memo en el hijo:
const Child = memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>
})`}
      </pre>
    </div>
  )
}

function Comparacion() {
  return (
    <div className="example-card">
      <h3>3. Comparación: useMemo vs useCallback</h3>
      <div className="table-responsive">
        <table className="table table-dark table-bordered">
          <thead>
            <tr className="table-info">
              <th>Hook</th>
              <th>Memoriza</th>
              <th>Uso típico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>useMemo</code>
              </td>
              <td>
                El <strong>resultado</strong> de una función
              </td>
              <td>Cálculos costosos, filtros, transformaciones</td>
            </tr>
            <tr>
              <td>
                <code>useCallback</code>
              </td>
              <td>
                La <strong>definición</strong> de la función
              </td>
              <td>Callbacks pasados a hijos con React.memo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre className="code-block">
        {`// Son equivalentes:
useCallback(fn, deps)
useMemo(() => fn, deps)`}
      </pre>
    </div>
  )
}

export default function OptimizacionRendimiento() {
  return (
    <div>
      <h2 className="mb-4">Tema 4: Optimización de Rendimiento</h2>

      <div className="d-flex flex-column gap-3">
        <UseMemoDemo />
        <UseCallbackDemo />
        <Comparacion />
      </div>
    </div>
  )
}
