/**
 * ============================================
 * Removing Effect Dependencies
 * ============================================
 *
 * When you write an Effect, the linter will verify that you've included every
 * reactive value (like props and state) that the Effect reads in the list of
 * your Effect's dependencies. This ensures that your Effect remains synchronized
 * with the latest props and state of your component.
 *
 * Unnecessary dependencies may cause your Effect to run too often, or even
 * create an infinite loop.
 *
 * In this lesson, you'll learn how to review and remove unnecessary dependencies
 * from your Effects.
 *
 * ⚠️ IMPORTANT: Skip the useEffectEvent sections in the documentation -
 * this is an experimental API and will not be covered in the exam.
 * Focus on the other techniques for removing dependencies.
 *
 * Read:
 * - React Documentation > Removing Effect Dependencies
 */

import { useState, useEffect } from 'react'

// ─── Ejemplo: Object dependency problem ───────────────────────

function ChatRoomBad({ roomId }: { roomId: string }) {
  const serverUrl = 'https://localhost:1234'

  // ❌ Object dependency causes Effect to re-run on every render
  const options = { serverUrl, roomId }

  useEffect(() => {
    const connection = createConnection(options)
    connection.connect()
    return () => connection.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]) // New options object created on every render!

  return null
}

// ✅ Move object inside Effect to avoid dependency
function ChatRoomGood({ roomId }: { roomId: string }) {
  const serverUrl = 'https://localhost:1234'
  const [status, setStatus] = useState('disconnected')

  useEffect(() => {
    // ✅ Move object inside Effect to avoid dependency
    const options = { serverUrl, roomId }
    const connection = createConnection(options)
    connection.connect()
    setStatus('connected')

    return () => {
      connection.disconnect()
      setStatus('disconnected')
    }
  }, [roomId, serverUrl]) // Only primitive values as dependencies

  return (
    <span className={status === 'connected' ? 'text-success' : 'text-muted'}>
      {status === 'connected' ? '🟢' : '🔴'} {status} to #{roomId}
    </span>
  )
}

// Simulación
function createConnection(options: { serverUrl: string; roomId: string }) {
  return {
    connect() {
      console.log(`✅ Connected to #${options.roomId} at ${options.serverUrl}`)
    },
    disconnect() {
      console.log(`❌ Disconnected from #${options.roomId}`)
    },
  }
}

// ─── Demo interactiva ─────────────────────────────────────────

function InteractiveDemo() {
  const [roomId, setRoomId] = useState('general')
  const [renderCount, setRenderCount] = useState(0)

  return (
    <div className="example-card">
      <h3>Demo: Objeto dentro del Effect</h3>
      <p className="text-muted small">
        La conexión solo se re-sincroniza cuando cambia el roomId, no en cada render.
      </p>
      <div className="d-flex gap-2 mb-3">
        {['general', 'travel', 'music'].map((room) => (
          <button
            key={room}
            className={`btn btn-sm ${roomId === room ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setRoomId(room)}
          >
            #{room}
          </button>
        ))}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setRenderCount((c) => c + 1)}
        >
          Forzar re-render ({renderCount})
        </button>
      </div>
      <ChatRoomGood roomId={roomId} />
    </div>
  )
}

// Suppress unused warning
void ChatRoomBad

export default function RemovingEffectDependencies() {
  return (
    <div>
      <h2 className="mb-4">Removing Effect Dependencies</h2>

      <div className="example-card mb-3">
        <p>
          Cuando escribes un Effect, el linter verificará que hayas incluido cada valor reactivo
          (como props y estado) que el Effect lee en la lista de dependencias de tu Effect. Esto
          asegura que tu Effect permanezca sincronizado con las últimas props y estado de tu
          componente. Las dependencias innecesarias pueden causar que tu Effect se ejecute con
          demasiada frecuencia, o incluso crear un loop infinito.
        </p>
        <p>
          En esta lección, aprenderás cómo revisar y eliminar dependencias innecesarias de tus
          Effects.
        </p>
        <div className="example-card example-card--warning mt-2 mb-0">
          <p className="mb-0">
            ⚠️ <strong>IMPORTANTE:</strong> Omite las secciones de useEffectEvent en la
            documentación - es una API experimental y no se cubrirá en el examen. Enfócate en las
            otras técnicas para eliminar dependencias.
          </p>
        </div>
        <p className="text-muted small mt-2 mb-0">
          Leer: React Documentation {'>'} Removing Effect Dependencies
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <pre className="code-block">
          {`function ChatRoom({ roomId }) {
  const serverUrl = 'https://localhost:1234';

  // ❌ Object dependency causes Effect to re-run on every render
  const options = { serverUrl, roomId };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // New options object created on every render!

  // ✅ Move object inside Effect to avoid dependency
  useEffect(() => {
    const options = { serverUrl, roomId };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // Only primitive values as dependencies
}`}
        </pre>
      </div>

      <div className="example-card example-card--danger mb-3">
        <h3>❌ Problema: Objeto como dependencia</h3>
        <pre className="code-block">
          {`// Object is recreated on every render → new reference → Effect re-runs
const options = { serverUrl, roomId };

useEffect(() => {
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [options]); // ❌ options is a new object every render!`}
        </pre>
      </div>

      <div className="example-card example-card--success mb-3">
        <h3>✅ Solución: Mover objeto dentro del Effect</h3>
        <pre className="code-block">
          {`useEffect(() => {
  // ✅ Object created inside Effect - not a dependency
  const options = { serverUrl, roomId };
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [roomId, serverUrl]); // Only primitive values as dependencies`}
        </pre>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <InteractiveDemo />
    </div>
  )
}
