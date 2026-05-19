/**
 * ============================================
 * TEMA 3: Efectos con useEffect
 * ============================================
 *
 * useEffect permite ejecutar efectos secundarios en componentes funcionales.
 *
 * Equivalencias con ciclo de vida de clases:
 * ┌─────────────────────┬──────────────────────────┬─────────────────────────┐
 * │ Arreglo []          │ Equivalencia             │ Ejecución               │
 * ├─────────────────────┼──────────────────────────┼─────────────────────────┤
 * │ Sin arreglo         │ componentDidUpdate       │ Cada renderizado        │
 * │ Vacío []            │ componentDidMount        │ Una vez al montar       │
 * │ Con dependencias    │ Efecto condicional       │ Al cambiar dependencias │
 * │ Cleanup function    │ componentWillUnmount     │ Antes de desmontar      │
 * └─────────────────────┴──────────────────────────┴─────────────────────────┘
 */

import { useState, useEffect } from "react";

// Ejemplo 1: Sin arreglo de dependencias (cada render)
function EfectoCadaRender() {
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  // Se ejecuta en CADA renderizado
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
    console.log("🔄 Efecto ejecutado (cada render)");
  });

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Sin arreglo → Cada renderizado</h3>
      <p>
        Count: {count} | Renders: {renderCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Incrementar</button>
      <pre style={{ fontSize: "0.85rem" }}>
        {`// Equivale a componentDidUpdate
useEffect(() => {
  console.log("Se ejecuta en cada render");
}); // ← Sin segundo argumento`}
      </pre>
    </div>
  );
}

// Ejemplo 2: Arreglo vacío (solo al montar)
function EfectoAlMontar() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Se ejecuta UNA SOLA VEZ al montar el componente
  useEffect(() => {
    console.log("📦 Componente montado - Fetching data...");

    // Simulamos una llamada a API
    const timer = setTimeout(() => {
      setData("Datos cargados desde la API");
      setLoading(false);
    }, 1500);

    // Cleanup: se ejecuta al desmontar
    return () => {
      clearTimeout(timer);
      console.log("🧹 Cleanup: timer cancelado");
    };
  }, []); // ← Arreglo vacío = solo al montar

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Arreglo vacío [] → Una vez al montar</h3>
      {loading ? <p>⏳ Cargando...</p> : <p>✅ {data}</p>}
      <pre style={{ fontSize: "0.85rem" }}>
        {`// Equivale a componentDidMount
useEffect(() => {
  fetchData();
  return () => cleanup(); // componentWillUnmount
}, []); // ← Arreglo vacío`}
      </pre>
    </div>
  );
}

// Ejemplo 3: Con dependencias (efecto condicional)
function EfectoConDependencias() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState<string>("");

  // Se ejecuta solo cuando userId cambia
  useEffect(() => {
    console.log(`👤 Cargando usuario ${userId}...`);
    setUserData(
      `Usuario #${userId} - ${["Ana", "Carlos", "María", "Pedro", "Lucía"][userId - 1] ?? "Desconocido"}`,
    );

    return () => {
      console.log(`🧹 Limpiando efecto del usuario ${userId}`);
    };
  }, [userId]); // ← Solo se re-ejecuta si userId cambia

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Con dependencias → Al cambiar dependencias</h3>
      <p>{userData}</p>
      <div>
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{ fontWeight: userId === id ? "bold" : "normal" }}
          >
            User {id}
          </button>
        ))}
      </div>
      <pre style={{ fontSize: "0.85rem" }}>
        {`// Efecto condicional
useEffect(() => {
  loadUser(userId);
  return () => cancelRequest();
}, [userId]); // ← Se ejecuta al cambiar userId`}
      </pre>
    </div>
  );
}

// Ejemplo 4: Cleanup function (suscripciones, timers, listeners)
function EfectoCleanup() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    if (!isListening) return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    console.log("👂 Listener de resize añadido");

    // Cleanup: remover el listener al desmontar o cuando isListening cambie
    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("🧹 Listener de resize removido");
    };
  }, [isListening]);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Cleanup function → Antes de desmontar</h3>
      <p>Ancho de ventana: {windowWidth}px</p>
      <button onClick={() => setIsListening((l) => !l)}>
        {isListening ? "⏸ Pausar listener" : "▶️ Activar listener"}
      </button>
      <pre style={{ fontSize: "0.85rem" }}>
        {`// Equivale a componentWillUnmount
useEffect(() => {
  window.addEventListener("resize", handler);
  return () => {
    window.removeEventListener("resize", handler);
  };
}, []);`}
      </pre>
    </div>
  );
}

// Componente principal del tema
export default function UseEffectDemo() {
  return (
    <div>
      <h2>Tema 3: Efectos con useEffect</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <EfectoCadaRender />
        <EfectoAlMontar />
        <EfectoConDependencias />
        <EfectoCleanup />
      </div>
    </div>
  );
}
