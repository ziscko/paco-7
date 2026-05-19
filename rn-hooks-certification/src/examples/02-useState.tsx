/**
 * ============================================
 * TEMA 2: Manejo de Estado con useState
 * ============================================
 *
 * useState añade estado local a componentes funcionales de forma sencilla.
 *
 * Sintaxis: const [state, setState] = useState(initialValue);
 *
 * Conceptos clave:
 * - Actualización funcional: setState(prev => prev + 1)
 * - Lazy initial state: useState(() => computeExpensiveValue())
 * - El estado es inmutable: siempre crear nuevas referencias
 */

import { useState } from "react";

// Ejemplo básico: Contador
function Contador() {
  const [count, setCount] = useState(0);

  // Actualización funcional: usa el valor previo para calcular el nuevo
  const incrementar = () => setCount((prev) => prev + 1);
  const decrementar = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Contador Básico</h3>
      <p>
        Valor: <strong>{count}</strong>
      </p>
      <button onClick={decrementar}>-1</button>{" "}
      <button onClick={reset}>Reset</button>{" "}
      <button onClick={incrementar}>+1</button>
      <pre style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
        {`const [count, setCount] = useState(0);

// Actualización funcional
setCount(prev => prev + 1);`}
      </pre>
    </div>
  );
}

// Ejemplo con objetos: Estado complejo
interface FormData {
  nombre: string;
  email: string;
  edad: number;
}

function FormularioEstado() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    edad: 0,
  });

  // ✅ Siempre crear un nuevo objeto (inmutabilidad)
  const handleChange = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Estado con Objetos</h3>
      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={(e) => handleChange("nombre", e.target.value)}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <input
        type="number"
        placeholder="Edad"
        value={form.edad}
        onChange={(e) => handleChange("edad", Number(e.target.value))}
      />
      <pre style={{ fontSize: "0.85rem" }}>{JSON.stringify(form, null, 2)}</pre>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#1a1a2e",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// ✅ Inmutabilidad: spread del estado previo
setForm(prev => ({ ...prev, [field]: value }));`}
      </pre>
    </div>
  );
}

// Ejemplo: Lazy Initial State
function LazyInitialState() {
  // La función solo se ejecuta en el PRIMER render
  const [items, setItems] = useState<string[]>(() => {
    console.log("⚡ Calculando estado inicial (solo una vez)");
    return Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`);
  });

  const agregarItem = () => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h3>Lazy Initial State</h3>
      <p>Útil cuando el valor inicial es costoso de calcular.</p>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <button onClick={agregarItem}>Agregar Item</button>

      <pre
        style={{
          fontSize: "0.85rem",
          background: "#1a1a2e",
          padding: "0.5rem",
          borderRadius: 4,
        }}
      >
        {`// Pasa una FUNCIÓN (no el resultado) a useState
const [items, setItems] = useState(() => {
  return computeExpensiveValue(); // Solo se ejecuta 1 vez
});`}
      </pre>
    </div>
  );
}

// Componente principal del tema
export default function UseStateDemo() {
  return (
    <div>
      <h2>Tema 2: Manejo de Estado con useState</h2>
      <p>Añade estado local a componentes funcionales de forma sencilla.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Contador />
        <FormularioEstado />
        <LazyInitialState />
      </div>
    </div>
  );
}
