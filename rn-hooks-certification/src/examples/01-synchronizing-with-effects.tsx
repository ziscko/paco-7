/**
 * ============================================
 * Synchronizing with Effects
 * ============================================
 *
 * Sometimes React components need to connect to external systems or perform
 * operations outside React's data flow.
 * In this lesson, you'll learn how to use the useEffect Hook to synchronize
 * your components with external systems like browser APIs, third-party
 * libraries, and network requests.
 *
 * Read:
 * - React Documentation > Synchronizing with Effects
 * - React Documentation > useEffect
 */

import { useState, useEffect } from 'react'

// ─── Ejemplo: WeatherWidget ───────────────────────────────────

function WeatherWidget() {
  const [location, setLocation] = useState('London')
  const [temperature, setTemperature] = useState<string | null>(null)

  useEffect(() => {
    // Connect to external weather API
    const subscription = weatherAPI.subscribe(location, (data: { temperature: string }) => {
      setTemperature(data.temperature)
    })

    // Cleanup: unsubscribe when component unmounts or location changes
    return () => {
      subscription.unsubscribe()
    }
  }, [location]) // Only re-run if location changes

  return (
    <div className="example-card">
      <h3>📍 Weather: {location}</h3>
      <p>Temperatura: {temperature ?? 'Cargando...'}</p>
      <div className="d-flex gap-2 mt-2">
        {['London', 'Paris', 'Tokyo', 'New York'].map((city) => (
          <button
            key={city}
            className={`btn btn-sm ${location === city ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setLocation(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

// Simulación del weatherAPI para la demo
const weatherAPI = {
  subscribe(
    location: string,
    callback: (data: { temperature: string }) => void,
  ): { unsubscribe: () => void } {
    const temps: Record<string, string> = {
      London: '12°C',
      Paris: '15°C',
      Tokyo: '22°C',
      'New York': '18°C',
    }
    const timer = setTimeout(() => {
      callback({ temperature: temps[location] ?? '??°C' })
    }, 800)
    return {
      unsubscribe: () => clearTimeout(timer),
    }
  },
}

// ─── Ejemplo interactivo: Timer con cleanup ───────────────────

function TimerDemo() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    // Cleanup: clear interval when component unmounts or isRunning changes
    return () => {
      clearInterval(interval)
    }
  }, [isRunning])

  return (
    <div className="example-card">
      <h3>⏱ Timer con Cleanup</h3>
      <p className="timer-display">{seconds}s</p>
      <div className="d-flex gap-2">
        <button
          className={`btn btn-sm ${isRunning ? 'btn-warning' : 'btn-success'}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '⏸ Pause' : '▶️ Start'}
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            setIsRunning(false)
            setSeconds(0)
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default function SynchronizingWithEffects() {
  return (
    <div>
      <h2 className="mb-4">Synchronizing with Effects</h2>

      <div className="example-card mb-3">
        <p>
          A veces los componentes de React necesitan conectarse a sistemas externos o realizar
          operaciones fuera del flujo de datos de React.
        </p>
        <p>
          En esta lección, aprenderás a usar el Hook <code>useEffect</code> para sincronizar tus
          componentes con sistemas externos como APIs del navegador, librerías de terceros y
          peticiones de red.
        </p>
        <p className="text-muted small mb-0">
          Leer: React Documentation {'>'} Synchronizing with Effects | React Documentation {'>'}{' '}
          useEffect
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <pre className="code-block">
          {`import { useState, useEffect } from 'react';

function WeatherWidget() {
  const [location, setLocation] = useState('London');
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    // Connect to external weather API
    const subscription = weatherAPI.subscribe(location, (data) => {
      setTemperature(data.temperature);
    });

    // Cleanup: unsubscribe when component unmounts or location changes
    return () => {
      subscription.unsubscribe();
    };
  }, [location]); // Only re-run if location changes

  return (
    ...
  );
}`}
        </pre>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <WeatherWidget />
      <TimerDemo />
    </div>
  )
}
