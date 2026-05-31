/**
 * ============================================
 * Optimizing with useCallback
 * ============================================
 *
 * Pequeña lección sobre `useCallback` para memorizar funciones y evitar
 * renders innecesarios en componentes hijos memoizados.
 *
 * Idea clave (en una línea): usa `useCallback` para mantener la identidad de
 * una función entre renders cuando la función se pasa a componentes memoizados
 * o se usa en dependencias de efectos.
 */
import React, { useState, useCallback } from 'react'
import CodeBlock from '../components/CodeBlock'

// Componente memoizado que muestra cuántas veces se ha renderizado
const CountButton = React.memo(function CountButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  const renders = React.useRef(0)
  renders.current++
  return (
    <button className="btn btn-sm btn-primary" onClick={onClick}>
      {children} (renders: {renders.current})
    </button>
  )
})

function UseCallbackDemo() {
  const [count, setCount] = useState(0)

  // Sin useCallback: esta función se recrea en cada render
  const incrementNoMemo = () => setCount((c) => c + 1)

  // Con useCallback: la identidad se mantiene entre renders mientras las deps no cambien
  const increment = useCallback(() => setCount((c) => c + 1), [])

  return (
    <div>
      <h3>useCallback — ejemplo sencillo</h3>
      <p className="text-muted small">
        Toca <strong>Toggle otro estado</strong> y observa los contadores de render en los botones
        memoizados: el botón que recibe la función sin `useCallback` se volverá a renderizar, el que
        recibe la función memoizada no.
      </p>

      <div className="d-flex gap-2 mb-3">
        <CountButton onClick={incrementNoMemo}>Incrementar (sin useCallback)</CountButton>
        <CountButton onClick={increment}>Incrementar (con useCallback)</CountButton>
      </div>

      <big className="mb-2">
        Count: <strong>{count}</strong>
      </big>

      <CodeBlock>
        {`// Sin useCallback
const incrementNoMemo = () => setCount(c => c + 1)

// Con useCallback
const increment = useCallback(() => setCount(c => c + 1), [])

`}
      </CodeBlock>
    </div>
  )
}

export default function OptimizingWithUseCallback() {
  return (
    <div>
      <h2 className="mb-4">Optimizing with useCallback</h2>

      <div className="example-card mb-3">
        <p>
          `useCallback` devuelve una versión memoizada de la función cuya identidad se mantiene
          entre renders si las dependencias no cambian. Es útil cuando pasas funciones a componentes
          memoizados o cuando quieres evitar que efectos se disparen por cambios de referencia.
        </p>
        <div className="example-card example-card--info mt-2 mb-0">
          <p className="mb-0">
            💡 TIP: A menudo no necesitas `useCallback` hasta que notes renders innecesarios o
            problemas con dependencias de efectos.
          </p>
        </div>
      </div>

      <div className="example-card mb-3">
        <UseCallbackDemo />
      </div>
    </div>
  )
}
