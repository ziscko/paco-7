/**
 * ============================================
 * Reusing Logic with Custom Hooks
 * ============================================
 *
 * React comes with several built-in Hooks like useState, useContext, and useEffect.
 * Sometimes, you'll wish that there was a Hook for some more specific purpose:
 * for example, to fetch data, to keep track of whether the user is online, or to
 * connect to a chat room. You might not find these Hooks in React, but you can
 * create your own Hooks for your application's needs.
 *
 * In this lesson, you'll learn how to extract component logic into custom Hooks
 * to share stateful logic between components, while following the Rules of Hooks
 * that ensure Hooks work correctly.
 *
 * 💡 TIP: Many libraries like React Use, useHooks, and Collection of React Hooks
 * provide ready-to-use custom hooks for common use cases.
 *
 * ⚠️ IMPORTANT: Skip the useEffectEvent sections in the documentation -
 * this is an experimental API and will not be covered in the exam.
 *
 * Read:
 * - React Documentation > Reusing Logic with Custom Hooks
 * - React Documentation > Rules of Hooks
 */

import { useState, useEffect } from 'react'

// ─── Ejemplo: useOnlineStatus ─────────────────────────────────

// ❌ Duplicated logic
function StatusBarBad() {
  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      // cleanup listeners...
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  return <h1>{isOnline ? 'Online' : 'Offline'}</h1>
}

// ✅ Extract into custom Hook
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    // ... some online/offline logic
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  return isOnline
}

// ✅ Reuse custom Hook
function StatusBar() {
  const isOnline = useOnlineStatus()
  return (
    <h4 className={isOnline ? 'text-success' : 'text-danger'}>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </h4>
  )
}

function SaveButton() {
  const isOnline = useOnlineStatus()
  return (
    <button
      className={`btn btn-sm ${isOnline ? 'btn-success' : 'btn-outline-secondary'}`}
      disabled={!isOnline}
    >
      {isOnline ? '💾 Guardar progreso' : '⏳ Reconectando...'}
    </button>
  )
}

// Suppress unused warning
void StatusBarBad

// ─── Custom Hook adicional: useFetch ──────────────────────────

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { data, loading, error }
}

function FetchDemo() {
  const [userId, setUserId] = useState(1)
  const { data, loading, error } = useFetch<{ name: string; email: string }>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  )

  return (
    <div className="example-card">
      <h3>Custom Hook: useFetch</h3>
      <div className="d-flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            className={`btn btn-sm ${userId === id ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
      </div>
      {loading && (
        <p>
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          Cargando...
        </p>
      )}
      {error && <p className="text-danger">❌ {error}</p>}
      {data && (
        <p className="text-success">
          ✅ {data.name} ({data.email})
        </p>
      )}
      <pre className="code-block mt-3">
        {`function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(res => res.json())
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}`}
      </pre>
    </div>
  )
}

export default function ReusingLogicWithCustomHooks() {
  return (
    <div>
      <h2 className="mb-4">Reusing Logic with Custom Hooks</h2>

      <div className="example-card mb-3">
        <p>
          React viene con varios Hooks integrados como useState, useContext y useEffect. A veces,
          desearás que hubiera un Hook para un propósito más específico: por ejemplo, para obtener
          datos, para rastrear si el usuario está en línea, o para conectarse a un chat room. Puede
          que no encuentres estos Hooks en React, pero puedes crear tus propios Hooks para las
          necesidades de tu aplicación.
        </p>
        <p>
          En esta lección, aprenderás cómo extraer lógica de componentes en custom Hooks para
          compartir lógica con estado entre componentes, siguiendo las Reglas de los Hooks que
          aseguran que los Hooks funcionen correctamente.
        </p>
        <p className="text-accent small">
          💡 TIP: Muchas librerías como React Use, useHooks y Collection of React Hooks proveen
          custom hooks listos para usar en casos de uso comunes.
        </p>
        <div className="example-card example-card--warning mt-2 mb-0">
          <p className="mb-0">
            ⚠️ <strong>IMPORTANTE:</strong> Omite las secciones de useEffectEvent en la
            documentación - es una API experimental y no se cubrirá en el examen.
          </p>
        </div>
        <p className="text-muted small mt-2 mb-0">
          Leer: React Documentation {'>'} Reusing Logic with Custom Hooks | React Documentation{' '}
          {'>'} Rules of Hooks
        </p>
      </div>

      <div className="example-card mb-3">
        <h3>Ejemplo</h3>
        <pre className="code-block">
          {`// ❌ Duplicated logic
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      // cleanup listeners...
    };
  }, []);
  return <h1>{isOnline ? 'Online' : 'Offline'}</h1>;
}

// ✅ Extract into custom Hook
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ... same online/offline logic
  }, []);
  return isOnline;
}

// ✅ Reuse custom Hook
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? 'Online' : 'Offline'}</h1>;
}`}
        </pre>
      </div>

      <h3 className="mb-3">Demo interactiva</h3>
      <div className="example-card mb-3">
        <h3>useOnlineStatus - Reutilizado en múltiples componentes</h3>
        <p className="text-muted small">
          Ambos componentes de abajo usan el mismo custom hook <code>useOnlineStatus()</code>:
        </p>
        <div className="d-flex align-items-center gap-3">
          <StatusBar />
          <SaveButton />
        </div>
        <p className="text-muted small mt-2 mb-0">
          Intenta desactivar tu conexión de red (DevTools {'>'} Network {'>'} Offline) para ver
          ambos actualizarse.
        </p>
      </div>

      <FetchDemo />
    </div>
  )
}
