/**
 * ============================================
 * Manipulating the DOM with Refs
 * ============================================
 *
 * React automatically updates the DOM to match your render output,
 * but sometimes you need to access DOM elements directly.
 * In this lesson, you'll learn how to use the useRef Hook to access
 * and manipulate DOM elements directly, such as focusing an input,
 * scrolling to an element, or measuring element sizes.
 *
 * Read:
 * - React Documentation > Manipulating the DOM with Refs
 */

import { useRef, useState } from 'react'
import CodeBlock from '../components/CodeBlock'

// ─── Ejemplo: TextInputWithFocusButton ────────────────────────

function TextInputWithFocusButton() {
  // Create a ref to store the input DOM element
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClick() {
    // When the button is clicked, focus the input element
    inputRef.current?.focus()
  }

  return (
    <div className="example-card">
      <h3>TextInputWithFocusButton</h3>
      <div className="d-flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type here..."
          className="input-app flex-grow-1"
        />
        <button className="btn btn-outline-info btn-sm" onClick={handleClick}>
          Enfocar el input
        </button>
      </div>
    </div>
  )
}

// ─── Demo adicional: Scroll to element ────────────────────────

function ScrollToDemo() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className="example-card">
      <h3>Scroll a un Elemento</h3>
      <div className="d-flex gap-2 mb-3">
        {['Section A', 'Section B', 'Section C'].map((label, i) => (
          <button key={i} className="btn btn-outline-info btn-sm" onClick={() => scrollTo(i)}>
            Ir a {label}
          </button>
        ))}
      </div>
      <div className="scroll-container">
        {['Section A', 'Section B', 'Section C'].map((label, i) => (
          <div
            key={i}
            ref={(el) => {
              sectionRefs.current[i] = el
            }}
            className="scroll-section"
          >
            <strong>{label}</strong>
            <p className="mb-0">
              Contenido de {label}. Haz scroll aquí usando los botones de arriba.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo adicional: Measuring element size ───────────────────

function MeasureDemo() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const measure = () => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect()
      setDimensions({ width: Math.round(rect.width), height: Math.round(rect.height) })
    }
  }

  return (
    <div className="example-card">
      <h3>Medir Tamaño de Elementos</h3>
      <div ref={boxRef} className="resizable-box">
        Redimensióname (arrastra la esquina inferior derecha)
      </div>
      <button className="btn btn-outline-info btn-sm" onClick={measure}>
        Medir
      </button>
      {dimensions.width > 0 && (
        <p className="mt-2 mb-0">
          Width: <strong>{dimensions.width}px</strong> | Height:{' '}
          <strong>{dimensions.height}px</strong>
        </p>
      )}
    </div>
  )
}

export default function ManipulatingDOMWithRefs() {
  return (
    <div>
      <h2 className="mb-4">Manipulating the DOM with Refs</h2>

      <div className="example-card mb-3">
        <p>
          React actualiza automáticamente el DOM para que coincida con tu salida de render, pero a
          veces necesitas acceder a elementos del DOM directamente.
        </p>
        <p>
          En esta lección, aprenderás a usar el Hook <code>useRef</code> para acceder y manipular
          elementos del DOM directamente, como enfocar un input, hacer scroll a un elemento o medir
          el tamaño de un elemento.
        </p>
        <p className="text-muted small mb-0">
          Leer: React Documentation {'>'} Manipulating the DOM with Refs
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <CodeBlock>
          {`import { useRef } from 'react';

function TextInputWithFocusButton() {
  // Create a ref to store the input DOM element
  const inputRef = useRef(null);

  function handleClick() {
    // When the button is clicked, focus the input element
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={handleClick}>Focus the input</button>
    </div>
  );
}`}
        </CodeBlock>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <TextInputWithFocusButton />
      <ScrollToDemo />
      <MeasureDemo />
    </div>
  )
}
