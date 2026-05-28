/**
 * ============================================
 * Lifecycle of Reactive Effects
 * ============================================
 *
 * Effects have a different lifecycle from components. An Effect can only start
 * synchronizing something, and later stop synchronizing it. This cycle can happen
 * multiple times if your Effect depends on props and state that change over time.
 *
 * In this lesson, you'll learn how an Effect's lifecycle differs from a component's
 * lifecycle, how dependencies are determined, and how React's linter helps verify
 * your dependencies are correct.
 *
 * Read:
 * - React Documentation > Lifecycle of Reactive Effects
 */

import { useState, useEffect } from 'react'

// ─── Ejemplo: ChatRoom ────────────────────────────────────────

function ChatRoom({ roomId }: { roomId: string }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    // Effect starts synchronizing
    const connection = createConnection(serverUrl, roomId)
    connection.connect()
    setMessages((prev) => [...prev, `🟢 Connected to ${roomId} at ${serverUrl}`])

    // Effect stops synchronizing (cleanup)
    return () => {
      connection.disconnect()
      setMessages((prev) => [...prev, `🔴 Disconnected from ${roomId}`])
    }
  }, [serverUrl, roomId]) // Dependencies: Effect re-synchronizes when these change

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <label className="text-muted small">Server URL:</label>
        <input
          className="input-app flex-grow-1"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
        />
      </div>
      <div
        style={{
          maxHeight: '120px',
          overflow: 'auto',
          background: '#0d1117',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
        {messages.length === 0 && <span className="text-muted">Sin mensajes aún...</span>}
      </div>
    </div>
  )
}

// Simulación de createConnection
function createConnection(serverUrl: string, roomId: string) {
  return {
    connect() {
      console.log(`✅ Connecting to "${roomId}" at ${serverUrl}...`)
    },
    disconnect() {
      console.log(`❌ Disconnected from "${roomId}" at ${serverUrl}`)
    },
  }
}

// ─── Demo interactiva ─────────────────────────────────────────

function DependenciesDemo() {
  const [roomId, setRoomId] = useState('general')

  return (
    <div className="example-card">
      <h3>ChatRoom - Demo de Ciclo de Vida</h3>
      <p className="text-muted small">
        Cambia el room o el server URL para ver cómo el Effect se re-sincroniza (disconnect +
        connect).
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
      </div>
      <ChatRoom roomId={roomId} />
    </div>
  )
}

function MissingDependencyDemo() {
  return (
    <div className="example-card example-card--danger">
      <h3>❌ Dependencia faltante</h3>
      <pre className="code-block">
        {`// ❌ Missing dependency - Effect won't re-synchronize when serverUrl changes
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // serverUrl is missing!`}
      </pre>
      <p className="text-muted small mt-2">
        Si <code>serverUrl</code> cambia, el Effect no se re-ejecutará y permanecerá conectado al
        servidor anterior.
      </p>
    </div>
  )
}

function CorrectDependenciesDemo() {
  return (
    <div className="example-card example-card--success">
      <h3>✅ Dependencias correctas</h3>
      <pre className="code-block">
        {`// ✅ Correct dependencies - Effect will re-synchronize when either changes
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl, roomId]); // Both dependencies listed`}
      </pre>
      <p className="text-muted small mt-2">
        El Effect se re-sincroniza cada vez que <code>serverUrl</code> o <code>roomId</code>{' '}
        cambian.
      </p>
    </div>
  )
}

export default function LifecycleOfReactiveEffects() {
  return (
    <div>
      <h2 className="mb-4">Lifecycle of Reactive Effects</h2>

      <div className="example-card mb-3">
        <p>
          Los Effects tienen un ciclo de vida diferente al de los componentes. Un Effect solo puede
          empezar a sincronizar algo, y luego dejar de sincronizarlo. Este ciclo puede ocurrir
          múltiples veces si tu Effect depende de props y estado que cambian con el tiempo.
        </p>
        <p>
          En esta lección, aprenderás cómo el ciclo de vida de un Effect difiere del ciclo de vida
          de un componente, cómo se determinan las dependencias, y cómo el linter de React ayuda a
          verificar que tus dependencias sean correctas.
        </p>
        <p className="text-muted small mb-0">
          Leer: React Documentation {'>'} Lifecycle of Reactive Effects
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <pre className="code-block">
          {`function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    // Effect starts synchronizing
    const connection = createConnection(serverUrl, roomId);
    connection.connect();

    // Effect stops synchronizing (cleanup)
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // Dependencies: Effect re-synchronizes when these change

  // ❌ Missing dependency - Effect won't re-synchronize when serverUrl changes
  // }, [roomId]);

  // ✅ Correct dependencies - Effect will re-synchronize when either changes
  // }, [serverUrl, roomId]);
}`}
        </pre>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <DependenciesDemo />

      <h3 className="mb-3">Patrones de dependencias</h3>
      <MissingDependencyDemo />
      <CorrectDependenciesDemo />
    </div>
  )
}
