/**
 * ============================================
 * TEMA 1: Reglas Fundamentales de los Hooks
 * ============================================
 *
 * Las reglas de los Hooks son esenciales para que React
 * pueda rastrear correctamente el estado entre renders.
 *
 * REGLAS:
 * 1. Solo llamar Hooks en el nivel superior (no dentro de bucles, condiciones o funciones anidadas)
 * 2. Solo llamar Hooks desde componentes funcionales o custom hooks
 * 3. Usar el plugin de ESLint (eslint-plugin-react-hooks) para validar el orden
 */

import { useState, useEffect } from 'react'

// ✅ CORRECTO: Hooks siempre en el nivel superior
function BuenEjemplo() {
  const [user, setUser] = useState<string | null>(null)
  const [showLoggedIn, setShowLoggedIn] = useState(true)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (showLoggedIn) {
      setUser('Usuario Autenticado')
    } else {
      setUser(null)
    }
  }, [showLoggedIn])

  return (
    <>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showLoggedIn}
          onChange={(e) => setShowLoggedIn(e.target.checked)}
          id="loginCheck"
        />
        <label className="form-check-label" htmlFor="loginCheck">
          Simular usuario autenticado
        </label>
      </div>

      <div className="example-card">
        <h3>✅ Ejemplo Correcto</h3>
        <p>Usuario: {user ?? 'No autenticado'}</p>
        <p>Tema: {theme}</p>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        >
          Cambiar tema
        </button>
      </div>
    </>
  )
}

// ❌ INCORRECTO: Hook dentro de una condición
function MalEjemplo() {
  // React depende del ORDEN de llamada de los hooks entre renders.
  // Si un hook se salta, todos los siguientes se desalinean.

  return (
    <div className="example-card example-card--danger">
      <h3>❌ Mal Ejemplo</h3>
      <p className="text-light">Estos patrones violan las reglas de los Hooks:</p>

      <pre className="code-block">
        {`// ❌ Hook dentro de una condición
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null) // ❌ NO HACER
  }
  // React pierde el orden de los hooks si la condición cambia
}

// ❌ Hook dentro de un bucle
function Component() {
  for (let i = 0; i < 5; i++) {
    const [value, setValue] = useState(0) // ❌ NO HACER
  }
}

// ❌ Hook en función anidada regular
function Component() {
  function fetchData() {
    const [data, setData] = useState(null) // ❌ NO HACER
    // No es un componente ni un custom hook
  }
}`}
      </pre>

      <p className="mt-3 text-light">
        <strong>¿Por qué falla?</strong> React identifica cada hook por su posición (1°, 2°, 3°...).
        Si un hook se salta condicionalmente, todos los siguientes se desalinean y el estado se
        corrompe.
      </p>
    </div>
  )
}

// ✅ Usar array en el estado en vez de hooks en bucle
function HookEnBucle() {
  const [values, setValues] = useState([0, 0, 0, 0, 0])

  const incrementar = (index: number) => {
    setValues((prev) => prev.map((v, i) => (i === index ? v + 1 : v)))
  }

  return (
    <div className="example-card">
      <h3>✅ Estado como array (en vez de hooks en bucle)</h3>
      <div className="d-flex gap-2 flex-wrap">
        {values.map((val, i) => (
          <button className="btn btn-outline-info btn-sm" key={i} onClick={() => incrementar(i)}>
            Valor {i}: {val}
          </button>
        ))}
      </div>
      {/* <pre>{JSON.stringify(values)}</pre> */}
    </div>
  )
}

export default function ReglasFundamentales() {
  return (
    <div>
      <h2 className="mb-4">Tema 1: Reglas Fundamentales de los Hooks</h2>

      <div className="example-card mb-3">
        <h3>Resumen de Reglas</h3>
        <ol>
          <li>
            <strong>Nivel Superior:</strong> No llamar Hooks dentro de bucles, condiciones o
            funciones anidadas.
          </li>
          <li>
            <strong>Funciones React:</strong> Llamarlos solo desde componentes funcionales o Hooks
            personalizados.
          </li>
          <li>
            <strong>Linter:</strong> Usa el plugin oficial para asegurar que el orden de los Hooks
            sea consistente.
          </li>
        </ol>
      </div>

      <BuenEjemplo />
      <MalEjemplo />
      <HookEnBucle />
    </div>
  )
}
