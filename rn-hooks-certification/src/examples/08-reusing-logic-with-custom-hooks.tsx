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
import CodeBlock from '../components/CodeBlock'

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
        <CodeBlock>
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
        </CodeBlock>
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
    </div>
  )
}
