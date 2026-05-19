/**
 * ============================================
 * TEMA 3: Efectos con useEffect
 * ============================================
 *
 * useEffect permite ejecutar efectos secundarios en componentes funcionales.
 *
 * Equivalencias con ciclo de vida de clases:
 * | Arreglo []        | Equivalencia           | Ejecución              |
 * |-------------------|------------------------|------------------------|
 * | Sin arreglo       | componentDidUpdate     | Cada renderizado       |
 * | Vacío []          | componentDidMount      | Una vez al montar      |
 * | Con dependencias  | Efecto condicional     | Al cambiar dependencias|
 * | Cleanup function  | componentWillUnmount   | Antes de desmontar     |
 */

import { useState, useEffect } from 'react'

function EfectoCadaRender() {
  const [count, setCount] = useState(0)
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    setRenderCount((prev) => prev + 1)
  })

  return (
    <div className="example-card">
      <h3>1. Sin arreglo → Cada renderizado</h3>
      <p>
        Count: {count} | Renders: {renderCount}
      </p>
      <button className="btn btn-outline-light btn-sm" onClick={() => setCount((c) => c + 1)}>
        Incrementar
      </button>
      <pre className="code-block mt-3">
        {`// Equivale a componentDidUpdate
useEffect(() => {
  console.log("Se ejecuta en cada render")
}) // ← Sin segundo argumento`}
      </pre>
    </div>
  )
}

function EfectoAlMontar() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData('Datos cargados desde la API')
      setLoading(false)
    }, 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="example-card">
      <h3>2. Arreglo vacío [] → Una vez al montar</h3>
      {loading ? (
        <p>
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          Cargando...
        </p>
      ) : (
        <p className="text-success">✅ {data}</p>
      )}
      <pre className="code-block mt-3">
        {`// Equivale a componentDidMount
useEffect(() => {
  fetchData()
  return () => cleanup() // componentWillUnmount
}, []) // ← Arreglo vacío`}
      </pre>
    </div>
  )
}

function EfectoConDependencias() {
  const [userId, setUserId] = useState(1)
  const [userData, setUserData] = useState<string>('')

  useEffect(() => {
    setUserData(
      `Usuario #${userId} - ${['Ana', 'Carlos', 'María', 'Pedro', 'Lucía'][userId - 1] ?? 'Desconocido'}`,
    )

    return () => {
      console.log(`🧹 Limpiando efecto del usuario ${userId}`)
    }
  }, [userId])

  return (
    <div className="example-card">
      <h3>3. Con dependencias → Al cambiar dependencias</h3>
      <p>{userData}</p>
      <div className="d-flex gap-2">
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={`btn btn-sm ${userId === id ? 'btn-info' : 'btn-outline-info'}`}
          >
            User {id}
          </button>
        ))}
      </div>
      <pre className="code-block mt-3">
        {`// Efecto condicional
useEffect(() => {
  loadUser(userId)
  return () => cancelRequest()
}, [userId]) // ← Se ejecuta al cambiar userId`}
      </pre>
    </div>
  )
}

function EfectoCleanup() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isListening, setIsListening] = useState(true)

  useEffect(() => {
    if (!isListening) return

    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isListening])

  return (
    <div className="example-card">
      <h3>4. Cleanup function → Antes de desmontar</h3>
      <p>
        Ancho de ventana: <strong>{windowWidth}px</strong>
      </p>
      <button
        className={`btn btn-sm ${isListening ? 'btn-warning' : 'btn-success'}`}
        onClick={() => setIsListening((l) => !l)}
      >
        {isListening ? '⏸ Pausar listener' : '▶️ Activar listener'}
      </button>
      <pre className="code-block mt-3">
        {`// Equivale a componentWillUnmount
useEffect(() => {
  window.addEventListener("resize", handler)
  return () => {
    window.removeEventListener("resize", handler)
  }
}, [])`}
      </pre>
    </div>
  )
}

export default function UseEffectDemo() {
  return (
    <div>
      <h2 className="mb-4">Tema 3: Efectos con useEffect</h2>

      <div className="table-responsive mb-4">
        <table className="table table-dark table-bordered">
          <thead>
            <tr className="table-info">
              <th>Arreglo []</th>
              <th>Equivalencia</th>
              <th>Ejecución</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sin arreglo</td>
              <td>componentDidUpdate</td>
              <td>Cada renderizado</td>
            </tr>
            <tr>
              <td>Vacío []</td>
              <td>componentDidMount</td>
              <td>Una vez al montar</td>
            </tr>
            <tr>
              <td>Con dependencias</td>
              <td>Efecto condicional</td>
              <td>Al cambiar dependencias</td>
            </tr>
            <tr>
              <td>Cleanup function</td>
              <td>componentWillUnmount</td>
              <td>Antes de desmontar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-column gap-3">
        <EfectoCadaRender />
        <EfectoAlMontar />
        <EfectoConDependencias />
        <EfectoCleanup />
      </div>
    </div>
  )
}
