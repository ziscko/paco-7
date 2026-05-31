/**
 * ============================================
 * Separating Events from Effects
 * ============================================
 *
 * Event handlers only re-run when you perform the same interaction again.
 * Unlike event handlers, Effects re-synchronize if some value they read,
 * like a prop or a state variable, is different from what it was during
 * the last render.
 *
 * In this lesson, you'll learn the difference between reactive and
 * non-reactive logic, and how to identify which values should trigger
 * Effect re-runs.
 *
 * ⚠️ IMPORTANT: Skip the useEffectEvent sections in the documentation -
 * this is an experimental API and will not be covered in the exam.
 * Focus only on understanding reactive vs non-reactive logic.
 *
 * Read:
 * - React Documentation > Separating Events from Effects
 */

import { useState, useEffect, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'

// ─── Ejemplo: ChatRoom ────────────────────────────────────────

function ChatRoom({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('') // Reactive value
  const [messages, setMessages] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  // Event handler - NOT reactive
  function handleSendClick() {
    sendMessage(roomId, message) // Reads reactive values but doesn't react to changes
    setMessages((prev) => [...prev, `📤 Sent to #${roomId}: "${message}"`])
    setMessage('')
  }

  // Effect - REACTIVE
  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()
    setMessages((prev) => [...prev, `🟢 Connected to #${roomId}`])

    return () => {
      connection.disconnect()
      setMessages((prev) => [...prev, `🔴 Disconnected from #${roomId}`])
    }
  }, [roomId]) // Re-runs when roomId changes

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div>
      <div className="message-log" ref={logRef}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
        {messages.length === 0 && <span className="text-muted">Sin mensajes aún...</span>}
      </div>
      <div className="d-flex gap-2">
        <input
          className="input-app flex-grow-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="btn btn-outline-info btn-sm"
          onClick={handleSendClick}
          disabled={message.trim() === ''}
        >
          Enviar
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-outline-secondary btn-sm my-2" onClick={() => setMessages([])}>
          Clear log
        </button>
      </div>
    </div>
  )
}

// Simulaciones
function createConnection(roomId: string) {
  return {
    connect() {
      console.log(`✅ Connected to #${roomId}`)
    },
    disconnect() {
      console.log(`❌ Disconnected from #${roomId}`)
    },
  }
}

function sendMessage(roomId: string, message: string) {
  console.log(`📤 Sending "${message}" to #${roomId}`)
}

// ─── Demo interactiva ─────────────────────────────────────────

function EventVsEffectDemo() {
  const [roomId, setRoomId] = useState('general')

  return (
    <div className="example-card">
      <h3>ChatRoom - Events vs Effects</h3>
      <p className="text-muted small">
        Cambiar el room re-ejecuta el Effect (reactivo). Enviar un mensaje es un Event Handler (no
        reactivo).
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

function ComparisonTable() {
  return (
    <div className="example-card">
      <h3>Event Handlers vs Effects</h3>
      <div className="table-responsive">
        <table className="table table-dark table-bordered">
          <thead>
            <tr className="table-info">
              <th></th>
              <th>Event Handlers</th>
              <th>Effects</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Cuándo se ejecuta</strong>
              </td>
              <td>En respuesta a una interacción específica</td>
              <td>Cuando una dependencia reactiva cambia</td>
            </tr>
            <tr>
              <td>
                <strong>Reactivo</strong>
              </td>
              <td>No - solo se ejecuta cuando el usuario interactúa</td>
              <td>Sí - se re-sincroniza automáticamente</td>
            </tr>
            <tr>
              <td>
                <strong>Ejemplo</strong>
              </td>
              <td>
                <code>handleSendClick()</code>
              </td>
              <td>
                <code>useEffect(..., [roomId])</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SeparatingEventsFromEffects() {
  return (
    <div>
      <h2 className="mb-4">Separating Events from Effects</h2>

      <div className="example-card mb-3">
        <p>
          Los event handlers solo se re-ejecutan cuando realizas la misma interacción de nuevo. A
          diferencia de los event handlers, los Effects se re-sincronizan si algún valor que leen,
          como una prop o una variable de estado, es diferente de lo que era durante el último
          render.
        </p>
        <p className="text-muted small mt-2 mb-0">
          Leer: React Documentation {'>'} Separating Events from Effects
        </p>
      </div>
      <ComparisonTable />

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <CodeBlock>
          {`function ChatRoom({ roomId }) {
  const [message, setMessage] = useState(''); // Reactive value

  // Event handler - NOT reactive
  function handleSendClick() {
    sendMessage(roomId, message); // Reads reactive values but doesn't react to changes
  }

  // Effect - REACTIVE
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // Re-runs when roomId changes
}`}
        </CodeBlock>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <EventVsEffectDemo />
      <div className="py-5"></div>
    </div>
  )
}
