/**
 * ============================================
 * TEMA 2: Manejo de Estado con useState
 * ============================================
 *
 * useState añade estado local a componentes funcionales de forma sencilla.
 *
 * Sintaxis: const [state, setState] = useState(initialValue)
 *
 * Conceptos clave:
 * - Actualización funcional: setState(prev => prev + 1)
 * - Lazy initial state: useState(() => computeExpensiveValue())
 * - El estado es inmutable: siempre crear nuevas referencias
 */

import { useState } from 'react'

function Contador() {
  const [count, setCount] = useState(0)

  const incrementar = () => setCount((prev) => prev + 1)
  const decrementar = () => setCount((prev) => prev - 1)
  const reset = () => setCount(0)

  return (
    <div className="example-card">
      <h3>1. Contador Básico</h3>
      <p>
        Valor: <strong>{count}</strong>
      </p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-danger btn-sm" onClick={decrementar}>
          -1
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={reset}>
          Reset
        </button>
        <button className="btn btn-outline-success btn-sm" onClick={incrementar}>
          +1
        </button>
      </div>

      <pre className="code-block mt-3">
        {`const [count, setCount] = useState(0)

// Actualización funcional
setCount(prev => prev + 1)`}
      </pre>
    </div>
  )
}

interface FormData {
  nombre: string
  email: string
  edad: number
}

function FormularioEstado() {
  const [form, setForm] = useState<FormData>({
    nombre: '',
    email: '',
    edad: 0,
  })

  const handleChange = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="example-card">
      <h3>2. Estado con Objetos</h3>
      <div className="d-flex flex-column gap-2 mb-3">
        <input
          className="input-app"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
        />
        <input
          className="input-app"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <input
          className="input-app"
          type="number"
          placeholder="Edad"
          value={form.edad}
          onChange={(e) => handleChange('edad', Number(e.target.value))}
        />
      </div>
      <pre className="code-block">{JSON.stringify(form, null, 2)}</pre>

      <pre className="code-block">
        {`// ✅ Inmutabilidad: spread del estado previo
setForm(prev => ({ ...prev, [field]: value }))`}
      </pre>
    </div>
  )
}

function LazyInitialState() {
  const [items, setItems] = useState<string[]>(() => {
    console.log('⚡ Calculando estado inicial (solo una vez)')
    return Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`)
  })

  const agregarItem = () => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`])
  }

  return (
    <div className="example-card">
      <h3>3. Lazy Initial State</h3>
      <p>Útil cuando el valor inicial es costoso de calcular.</p>
      <ul className="list-group list-group-flush mb-3">
        {items.map((item, i) => (
          <li className="list-group-item bg-transparent text-light border-secondary" key={i}>
            {item}
          </li>
        ))}
      </ul>
      <button className="btn btn-outline-info btn-sm" onClick={agregarItem}>
        Agregar Item
      </button>

      <pre className="code-block mt-3">
        {`// Pasa una FUNCIÓN (no el resultado) a useState
const [items, setItems] = useState(() => {
  return computeExpensiveValue() // Solo se ejecuta 1 vez
})`}
      </pre>
    </div>
  )
}

export default function UseStateDemo() {
  return (
    <div>
      <h2 className="mb-4">Tema 2: Manejo de Estado con useState</h2>
      <p className="mb-4">Añade estado local a componentes funcionales de forma sencilla.</p>

      <div className="d-flex flex-column gap-3">
        <Contador />
        <FormularioEstado />
        <LazyInitialState />
      </div>
    </div>
  )
}
