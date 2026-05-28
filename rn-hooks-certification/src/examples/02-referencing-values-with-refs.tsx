/**
 * ============================================
 * Referencing Values with Refs
 * ============================================
 *
 * While state is ideal for storing values that should trigger re-renders,
 * sometimes you need to store information that doesn't affect the visual output.
 * In this lesson, you'll learn how to use the useRef Hook to hold onto values
 * that persist between renders without causing re-renders.
 *
 * Read:
 * - React Documentation > Referencing Values with Refs
 * - React Documentation > useRef
 */

import { useState, useRef } from 'react'

// ─── Ejemplo: Counter con clickCountRef ───────────────────────

function Counter() {
  const [count, setCount] = useState(0)

  // This ref holds the number of button clicks without causing re-renders
  const clickCountRef = useRef(0)

  function handleClick() {
    // Update the ref value (doesn't trigger a re-render)
    clickCountRef.current = clickCountRef.current + 1
    console.log(`You've clicked ${clickCountRef.current} times`)

    // Update state (causes a re-render)
    setCount(count + 1)
  }

  return (
    <div className="example-card">
      <h3>Counter: {count}</h3>
      <p>Revisa la consola para ver el total de clics</p>
      <p className="text-muted small">
        clickCountRef.current = <strong>{clickCountRef.current}</strong> (actualizado sin re-render)
      </p>
      <button className="btn btn-outline-info btn-sm" onClick={handleClick}>
        Haz clic
      </button>
    </div>
  )
}

// ─── Demo adicional: Stopwatch con useRef ─────────────────────

function Stopwatch() {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [now, setNow] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function handleStart() {
    setStartTime(Date.now())
    setNow(Date.now())

    intervalRef.current = setInterval(() => {
      setNow(Date.now())
    }, 10)
  }

  function handleStop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function handleReset() {
    handleStop()
    setStartTime(null)
    setNow(null)
  }

  let secondsPassed = 0
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000
  }

  return (
    <div className="example-card">
      <h3>⏱ Stopwatch (useRef para intervalRef)</h3>
      <p className="timer-display">{secondsPassed.toFixed(2)}s</p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-success btn-sm" onClick={handleStart}>
          Start
        </button>
        <button className="btn btn-outline-warning btn-sm" onClick={handleStop}>
          Stop
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
          Reset
        </button>
      </div>
      <pre className="code-block mt-3">
        {`// useRef para guardar el interval ID
const intervalRef = useRef(null);

// No causa re-render al asignar
intervalRef.current = setInterval(...);

// Acceder al valor para limpiar
clearInterval(intervalRef.current);`}
      </pre>
    </div>
  )
}

export default function ReferencingValuesWithRefs() {
  return (
    <div>
      <h2 className="mb-4">Referencing Values with Refs</h2>

      <div className="example-card mb-3">
        <p>
          Mientras que el estado es ideal para almacenar valores que deben disparar re-renders, a
          veces necesitas almacenar información que no afecta la salida visual.
        </p>
        <p>
          En esta lección, aprenderás a usar el Hook <code>useRef</code> para mantener valores que
          persisten entre renders sin causar re-renders.
        </p>
        <p className="text-muted small mb-0">
          Leer: React Documentation {'>'} Referencing Values with Refs | React Documentation {'>'}{' '}
          useRef
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <pre className="code-block">
          {`import { useRef, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // This ref holds the number of button clicks without causing re-renders
  const clickCountRef = useRef(0);

  function handleClick() {
    // Update the ref value (doesn't trigger a re-render)
    clickCountRef.current = clickCountRef.current + 1;
    console.log(\`You've clicked \${clickCountRef.current} times\`);

    // Update state (causes a re-render)
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counter: {count}</h1>
      <p>Check the console to see total click count</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}`}
        </pre>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <Counter />
      <Stopwatch />
    </div>
  )
}
