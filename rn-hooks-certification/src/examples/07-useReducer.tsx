/**
 * ============================================
 * TEMA 7: Reducción con useReducer
 * ============================================
 *
 * useReducer es una alternativa a useState para lógicas de estado
 * complejas con múltiples sub-valores.
 *
 * Sintaxis: const [state, dispatch] = useReducer(reducer, initialState)
 */

import { useReducer, useState } from 'react'

// ─── Ejemplo 1: Contador ──────────────────────────────────────

type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET'; payload: number }

interface CounterState {
  count: number
  history: number[]
}

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1, history: [...state.history, state.count + 1] }
    case 'DECREMENT':
      return { count: state.count - 1, history: [...state.history, state.count - 1] }
    case 'RESET':
      return { count: 0, history: [] }
    case 'SET':
      return { count: action.payload, history: [...state.history, action.payload] }
    default:
      return state
  }
}

function ContadorReducer() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] })

  return (
    <div className="example-card">
      <h3>1. Contador con useReducer</h3>
      <p className="fs-4">
        Count: <strong>{state.count}</strong>
      </p>

      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => dispatch({ type: 'DECREMENT' })}
        >
          -1
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Reset
        </button>
        <button
          className="btn btn-outline-success btn-sm"
          onClick={() => dispatch({ type: 'INCREMENT' })}
        >
          +1
        </button>
        <button
          className="btn btn-outline-warning btn-sm"
          onClick={() => dispatch({ type: 'SET', payload: 100 })}
        >
          Set 100
        </button>
      </div>

      <p className="text-muted small">Historial: [{state.history.slice(-5).join(', ')}]</p>

      <pre className="code-block">
        {`const [state, dispatch] = useReducer(reducer, initial)

dispatch({ type: "INCREMENT" })
dispatch({ type: "SET", payload: 100 })`}
      </pre>
    </div>
  )
}

// ─── Ejemplo 2: Formulario ────────────────────────────────────

interface FormState {
  username: string
  email: string
  password: string
  isSubmitting: boolean
  error: string | null
  success: boolean
}

type FormAction =
  | { type: 'FIELD_CHANGE'; field: string; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' }

const initialFormState: FormState = {
  username: '',
  email: '',
  password: '',
  isSubmitting: false,
  error: null,
  success: false,
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'FIELD_CHANGE':
      return { ...state, [action.field]: action.value, error: null }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, error: null }
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, success: true }
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, error: action.error }
    case 'RESET':
      return initialFormState
    default:
      return state
  }
}

function FormularioReducer() {
  const [state, dispatch] = useReducer(formReducer, initialFormState)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'SUBMIT_START' })

    setTimeout(() => {
      if (state.email.includes('@')) {
        dispatch({ type: 'SUBMIT_SUCCESS' })
      } else {
        dispatch({ type: 'SUBMIT_ERROR', error: 'Email inválido' })
      }
    }, 1000)
  }

  if (state.success) {
    return (
      <div className="example-card example-card--success">
        <h3>✅ Formulario enviado</h3>
        <p>Usuario: {state.username}</p>
        <button className="btn btn-outline-info btn-sm" onClick={() => dispatch({ type: 'RESET' })}>
          Nuevo formulario
        </button>
      </div>
    )
  }

  return (
    <div className="example-card">
      <h3>2. Formulario con useReducer</h3>
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 mb-3">
          <input
            className="input-app"
            placeholder="Username"
            value={state.username}
            onChange={(e) =>
              dispatch({ type: 'FIELD_CHANGE', field: 'username', value: e.target.value })
            }
          />
          <input
            className="input-app"
            placeholder="Email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: 'FIELD_CHANGE', field: 'email', value: e.target.value })
            }
          />
          <input
            className="input-app"
            type="password"
            placeholder="Password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: 'FIELD_CHANGE', field: 'password', value: e.target.value })
            }
          />
        </div>

        {state.error && <p className="text-danger">❌ {state.error}</p>}

        <div className="d-flex gap-2">
          <button className="btn btn-info btn-sm" type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => dispatch({ type: 'RESET' })}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Ejemplo 3: Todo List ─────────────────────────────────────

interface Todo {
  id: number
  text: string
  completed: boolean
}

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' }

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.text, completed: false }]
    case 'TOGGLE':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      )
    case 'DELETE':
      return state.filter((todo) => todo.id !== action.id)
    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed)
    default:
      return state
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: 'Aprender useReducer', completed: true },
    { id: 2, text: 'Practicar con ejemplos', completed: false },
  ])
  const [newTodo, setNewTodo] = useState('')

  const handleAdd = () => {
    if (newTodo.trim()) {
      dispatch({ type: 'ADD', text: newTodo.trim() })
      setNewTodo('')
    }
  }

  return (
    <div className="example-card">
      <h3>3. Todo List con useReducer</h3>

      <div className="d-flex gap-2 mb-3">
        <input
          className="input-app flex-grow-1"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nueva tarea..."
        />
        <button className="btn btn-outline-success btn-sm" onClick={handleAdd}>
          Agregar
        </button>
        <button
          className="btn btn-outline-warning btn-sm"
          onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
        >
          Limpiar completados
        </button>
      </div>

      <ul className="list-group list-group-flush">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item bg-transparent text-light border-secondary d-flex align-items-center gap-2"
          >
            <input
              className="form-check-input"
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
            />
            <span
              className={
                todo.completed
                  ? 'text-decoration-line-through text-muted flex-grow-1'
                  : 'flex-grow-1'
              }
            >
              {todo.text}
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function UseReducerDemo() {
  return (
    <div>
      <h2 className="mb-4">Tema 7: Reducción con useReducer</h2>
      <p className="mb-4">
        Alternativa a useState para lógicas de estado complejas con múltiples sub-valores.
      </p>

      <div className="d-flex flex-column gap-3">
        <ContadorReducer />
        <FormularioReducer />
        <TodoList />
      </div>
    </div>
  )
}
