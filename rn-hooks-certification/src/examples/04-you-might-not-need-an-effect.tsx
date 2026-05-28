/**
 * ============================================
 * You Might Not Need an Effect
 * ============================================
 *
 * Effects are an escape hatch from the React paradigm. They let you "step outside"
 * of React and synchronize your components with external systems like non-React
 * widgets, network, or the browser DOM. If there is no external system involved,
 * you shouldn't need an Effect.
 *
 * In this lesson, you'll learn when to avoid Effects and how removing unnecessary
 * Effects will make your code easier to follow, faster to run, and less error-prone.
 *
 * Read:
 * - React Documentation > You Might Not Need an Effect
 */

import { useState, useMemo } from 'react'

// ─── Ejemplo: Unnecessary Effect - transforming data ──────────

interface Todo {
  id: number
  text: string
  completed: boolean
}

// ❌ Unnecessary Effect - transforming data
function TodoListBad({ todos }: { todos: Todo[] }) {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([])

  // ❌ This Effect is unnecessary!
  // useEffect(() => {
  //   setVisibleTodos(todos.filter(todo => !todo.completed));
  // }, [todos]);

  // Simulating the bad pattern for display
  // (not actually running the effect to avoid confusion)
  void setVisibleTodos

  return (
    <div className="example-card example-card--danger">
      <h3>❌ Effect innecesario - transformando datos</h3>
      <pre className="code-block">
        {`function TodoList({ todos }) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => !todo.completed));
  }, [todos]);
}`}
      </pre>
      <p className="text-muted small mt-2">
        Esto causa un render extra: primero con datos obsoletos, luego con datos filtrados.
      </p>
    </div>
  )
}

// ✅ Better: derive state during rendering
function TodoListGood({ todos }: { todos: Todo[] }) {
  const visibleTodos = todos.filter((todo) => !todo.completed)

  return (
    <div className="example-card example-card--success">
      <h3>✅ Mejor: derivar estado durante el rendering</h3>
      <pre className="code-block">
        {`function TodoList({ todos }) {
  const visibleTodos = todos.filter(todo => !todo.completed);
}`}
      </pre>
      <p className="mt-2">
        Todos visibles: <strong>{visibleTodos.length}</strong>
      </p>
      <ul className="list-group list-group-flush">
        {visibleTodos.map((todo) => (
          <li key={todo.id} className="list-group-item bg-transparent text-light border-secondary">
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Demo interactiva ─────────────────────────────────────────

function InteractiveDemo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn useEffect', completed: true },
    { id: 2, text: 'Avoid unnecessary Effects', completed: false },
    { id: 3, text: 'Use derived state', completed: false },
    { id: 4, text: 'Read React docs', completed: true },
  ])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // ✅ Derive state during rendering (with useMemo for expensive computations)
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos((prev) => [...prev, { id: Date.now(), text: newTodo.trim(), completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  return (
    <div className="example-card">
      <h3>Demo: Estado Derivado (sin Effect)</h3>
      <div className="d-flex gap-2 mb-3">
        <input
          className="input-app flex-grow-1"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Nuevo todo..."
        />
        <button className="btn btn-outline-success btn-sm" onClick={addTodo}>
          Agregar
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="list-group list-group-flush">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item bg-transparent text-light border-secondary d-flex align-items-center gap-2"
          >
            <input
              type="checkbox"
              className="form-check-input"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'text-decoration-line-through text-muted' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>

      <pre className="code-block mt-3">
        {`// ✅ Derive state during rendering
const filteredTodos = useMemo(() => {
  switch (filter) {
    case 'active': return todos.filter(t => !t.completed);
    case 'completed': return todos.filter(t => t.completed);
    default: return todos;
  }
}, [todos, filter]);

// No useEffect needed! The value is computed directly.`}
      </pre>
    </div>
  )
}

export default function YouMightNotNeedAnEffect() {
  const sampleTodos: Todo[] = [
    { id: 1, text: 'Learn useEffect', completed: true },
    { id: 2, text: 'Avoid unnecessary Effects', completed: false },
    { id: 3, text: 'Use derived state', completed: false },
  ]

  return (
    <div>
      <h2 className="mb-4">You Might Not Need an Effect</h2>

      <div className="example-card mb-3">
        <p>
          Los Effects son una vía de escape del paradigma de React. Te permiten "salir" de React y
          sincronizar tus componentes con sistemas externos como widgets no-React, la red o el DOM
          del navegador. Si no hay un sistema externo involucrado, no deberías necesitar un Effect.
        </p>
        <p>
          En esta lección, aprenderás cuándo evitar Effects y cómo eliminar Effects innecesarios
          hará tu código más fácil de seguir, más rápido de ejecutar y menos propenso a errores.
        </p>
        <p className="text-muted small mb-0">
          Leer: React Documentation {'>'} You Might Not Need an Effect
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <pre className="code-block">
          {`// ❌ Unnecessary Effect - transforming data
function TodoList({ todos }) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => !todo.completed));
  }, [todos]);
}

// ✅ Better: derive state during rendering
function TodoList({ todos }) {
  const visibleTodos = todos.filter(todo => !todo.completed);
}`}
        </pre>
      </div>

      <div className="example-card mb-3">
        <h3>¿Por qué el código con useEffect es una mala práctica?</h3>
        <p>
          El primer código hace que la aplicación trabaje el doble. Cuando los datos cambian, React
          primero dibuja la pantalla con la lista vieja, luego se da cuenta de que hay un{' '}
          <code>useEffect</code>, calcula los datos nuevos, actualiza el estado y vuelve a borrar y
          redibujar la pantalla por segunda vez. Este doble renderizado hace que la página se vuelva
          lenta de forma totalmente innecesaria.
        </p>
        <p>
          El segundo código usa lo que se llama <strong>Estado Derivado</strong>. Como ya tienes la
          lista original en las props (<code>todos</code>), no necesitas crear un estado nuevo ni un
          efecto para limpiarla. Simplemente haces el <code>.filter()</code> directamente en el
          cuerpo de la función. De esta forma, React calcula los datos filtrados y dibuja la
          pantalla final de un solo golpe. Ahorras código, evitas errores de sincronización y tu
          aplicación va mucho más rápido.
        </p>
        <p className="mb-0">
          A esto se le llama <strong>Estado Derivado (Derived State)</strong>. En el ejemplo, como
          ya tienes la prop <code>todos</code>, no necesitas crear un estado duplicado llamado{' '}
          <code>visibleTodos</code>. Simplemente calculas la diferencia sobre la marcha durante el
          renderizado.
        </p>
      </div>

      <h3 className="mb-3 mt-4">Demo interactiva</h3>
      <InteractiveDemo />
    </div>
  )
}
