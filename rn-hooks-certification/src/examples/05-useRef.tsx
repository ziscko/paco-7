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
 */

import { useState, useRef, useEffect } from 'react'

function AccesoDOM() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const clearAndFocus = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="example-card">
      <h3>1. Acceso a nodos del DOM</h3>
      <p className="text-muted small">En React Native sería acceso a TextInput, ScrollView, etc.</p>

      <div className="d-flex gap-2 mb-3">
        <input
          ref={inputRef}
          className="input-app flex-grow-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe algo..."
        />
        <button className="btn btn-outline-info btn-sm" onClick={focusInput}>
          Focus
        </button>
        <button className="btn btn-outline-warning btn-sm" onClick={clearAndFocus}>
          Clear & Focus
        </button>
      </div>

      <pre className="code-block">
        {`

// En React Native:
const inputRef = useRef<HTMLInputElement>(null)

// Acceso directo al nodo
inputRef.current?.focus()`}
      </pre>
    </div>
  )
}

function ValorSinRender() {
  const [count, setCount] = useState(0)
  const renderCount = useRef(0)
  const previousCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
  })

  useEffect(() => {
    previousCount.current = count
  }, [count])

  return (
    <div className="example-card">
      <h3>2. Almacena valores sin disparar render</h3>

      <ul className="list-unstyled mb-3">
        <li>
          Count actual: <strong>{count}</strong>
        </li>
        <li>
          Count anterior: <strong>{previousCount.current}</strong>
        </li>
        <li>
          Número de renders: <strong>{renderCount.current}</strong>
        </li>
      </ul>

      <button className="btn btn-outline-success btn-sm" onClick={() => setCount((c) => c + 1)}>
        Incrementar
      </button>

      <pre className="code-block mt-3">
        {`const renderCount = useRef(0)

// Cambiar .current NO causa re-render
renderCount.current += 1

// Útil para guardar valores previos
const previousValue = useRef(currentValue)
useEffect(() => {
  previousValue.current = currentValue
}, [currentValue])`}
      </pre>
    </div>
  )
}

export default function UseRefDemo() {
  return (
    <div>
      <h2 className="mb-4">Tema 5: Acceso Directo y Referencias con useRef</h2>
      <p className="mb-4">
        Devuelve un objeto de referencia mutable que persiste durante el ciclo de vida.
      </p>

      <div className="d-flex flex-column gap-3">
        <AccesoDOM />
        <ValorSinRender />
      </div>
    </div>
  )
}
