/**
 * ============================================
 * TEMA 8: Custom Hooks y Reusabilidad
 * ============================================
 *
 * Los Custom Hooks permiten:
 * - Abstracción: Extraer lógica a funciones "useX"
 * - Clean Code: Componentes UI más delgados
 * - Reusabilidad: Compartir lógica entre componentes
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Custom Hooks ─────────────────────────────────────────────

function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue((v) => !v), [])
  return [value, toggle]
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useFetch<T>(url: string): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message })
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue)
  const increment = useCallback(() => setCount((c) => c + step), [step])
  const decrement = useCallback(() => setCount((c) => c - step), [step])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  return { count, increment, decrement, reset }
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

// ─── Demos ────────────────────────────────────────────────────

function ToggleDemo() {
  const [isOpen, toggle] = useToggle(false)

  return (
    <div className="example-card">
      <h3>1. useToggle</h3>
      <p>
        Estado: <strong>{isOpen ? 'Abierto' : 'Cerrado'}</strong>
      </p>
      <button className="btn btn-outline-info btn-sm" onClick={toggle}>
        Toggle
      </button>

      <pre className="code-block mt-3">
        {`function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle]
}

// Uso:
const [isOpen, toggle] = useToggle(false)`}
      </pre>
    </div>
  )
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('user-name', '')

  return (
    <div className="example-card">
      <h3>2. useLocalStorage</h3>
      <input
        className="input-app w-100 mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre (persiste en localStorage)"
      />
      <p>
        Valor guardado: <strong>{name || '(vacío)'}</strong>
      </p>
      <p className="text-muted small">Recarga la página y el valor persiste.</p>
    </div>
  )
}

function FetchDemo() {
  const { data, loading, error, refetch } = useFetch<{ title: string }>(
    'https://jsonplaceholder.typicode.com/todos/1',
  )

  return (
    <div className="example-card">
      <h3>3. useFetch</h3>
      {loading && (
        <p>
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          Cargando...
        </p>
      )}
      {error && <p className="text-danger">❌ Error: {error}</p>}
      {data && <p className="text-success">✅ Título: {data.title}</p>}
      <button className="btn btn-outline-info btn-sm" onClick={refetch}>
        Refetch
      </button>
    </div>
  )
}

function DebounceDemo() {
  const [text, setText] = useState('')
  const debouncedText = useDebounce(text, 500)

  return (
    <div className="example-card">
      <h3>4. useDebounce</h3>
      <input
        className="input-app w-100 mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe rápido..."
      />
      <p>Valor actual: {text}</p>
      <p>
        Valor debounced (500ms): <strong>{debouncedText}</strong>
      </p>
    </div>
  )
}

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0, 5)
  const previousCount = usePrevious(count)

  return (
    <div className="example-card">
      <h3>5. useCounter + usePrevious</h3>
      <p>
        Count: <strong>{count}</strong> (anterior: {previousCount ?? 'N/A'})
      </p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-danger btn-sm" onClick={decrement}>
          -5
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={reset}>
          Reset
        </button>
        <button className="btn btn-outline-success btn-sm" onClick={increment}>
          +5
        </button>
      </div>
    </div>
  )
}

export default function CustomHooksDemo() {
  return (
    <div>
      <h2 className="mb-4">Tema 8: Custom Hooks y Reusabilidad</h2>
      <p className="mb-4">Extrae lógica a funciones "useX" para componentes UI más delgados.</p>

      <div className="d-flex flex-column gap-3">
        <ToggleDemo />
        <LocalStorageDemo />
        <FetchDemo />
        <DebounceDemo />
        <CounterDemo />
      </div>
    </div>
  )
}
