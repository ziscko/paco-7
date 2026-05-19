/**
 * ============================================
 * TEMA 1: Reglas Fundamentales de los Hooks
 * ============================================
 *
 * Las reglas de los Hooks son esenciales para que React
 * pueda rastrear correctamente el estado entre renders.
 *
 * REGLAS:
 * 1. Solo llamar Hooks en el nivel superior (no dentro de bucles, condiciones o funciones anidadas)
 * 2. Solo llamar Hooks desde componentes funcionales o custom hooks
 * 3. Usar el plugin de ESLint (eslint-plugin-react-hooks) para validar el orden
 */

import { useState, useEffect } from "react";

// ❌ INCORRECTO: Hook dentro de una condición
function MalEjemplo({ isLoggedIn: _isLoggedIn }: { isLoggedIn: boolean }) {
  //   Esto viola la regla #1: nunca llamar hooks condicionalmente
  //   React depende del ORDEN de llamada de los hooks entre renders
  //   Si un hook se salta, todos los siguientes se desalinean

  //   if (isLoggedIn) {
  //     const [user, setUser] = useState(null); // ❌ NO HACER ESTO
  //   }

  return <p>Este componente muestra un anti-patrón (ver comentarios)</p>;
}

// ✅ CORRECTO: Hooks siempre en el nivel superior
function BuenEjemplo({ isLoggedIn }: { isLoggedIn: boolean }) {
  // Los hooks SIEMPRE se llaman, sin importar la condición
  const [user, setUser] = useState<string | null>(null);
  const [theme, setTheme] = useState("light");

  // La lógica condicional va DENTRO del hook, no alrededor
  useEffect(() => {
    if (isLoggedIn) {
      setUser("Usuario Autenticado");
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  return (
    <div>
      <h3>✅ Ejemplo Correcto</h3>
      <p>Usuario: {user ?? "No autenticado"}</p>
      <p>Tema: {theme}</p>
      <button
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      >
        Cambiar tema
      </button>
    </div>
  );
}

// ❌ INCORRECTO: Hook dentro de un bucle
function HookEnBucle() {
  // Esto NUNCA se debe hacer:
  // for (let i = 0; i < 5; i++) {
  //   const [value, setValue] = useState(0); // ❌
  // }

  // ✅ En su lugar, usar un array en el estado:
  const [values, setValues] = useState([0, 0, 0, 0, 0]);

  const incrementar = (index: number) => {
    setValues((prev) => prev.map((v, i) => (i === index ? v + 1 : v)));
  };

  return (
    <div>
      <h3>✅ Estado como array (en vez de hooks en bucle)</h3>
      {values.map((val, i) => (
        <button key={i} onClick={() => incrementar(i)}>
          Valor {i}: {val}
        </button>
      ))}
    </div>
  );
}

// ❌ INCORRECTO: Hook en función anidada regular
function HookEnFuncionAnidada() {
  // function obtenerDatos() {
  //   const [data, setData] = useState(null); // ❌ No es un componente ni custom hook
  // }

  // ✅ CORRECTO: Extraer a un Custom Hook (prefijo "use")
  return <p>Ver useCustomFetch en el tema de Custom Hooks</p>;
}

// Componente principal del tema
export default function ReglasFundamentales() {
  const [showLoggedIn, setShowLoggedIn] = useState(true);

  return (
    <div>
      <h2>Tema 1: Reglas Fundamentales de los Hooks</h2>

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          border: "1px solid #444",
          borderRadius: 8,
        }}
      >
        <h3>Resumen de Reglas</h3>
        <ol>
          <li>
            <strong>Nivel Superior:</strong> No llamar Hooks dentro de bucles,
            condiciones o funciones anidadas.
          </li>
          <li>
            <strong>Funciones React:</strong> Llamarlos solo desde componentes
            funcionales o Hooks personalizados.
          </li>
          <li>
            <strong>Linter:</strong> Usa el plugin oficial para asegurar que el
            orden de los Hooks sea consistente.
          </li>
        </ol>
      </div>

      <label>
        <input
          type="checkbox"
          checked={showLoggedIn}
          onChange={(e) => setShowLoggedIn(e.target.checked)}
        />{" "}
        Simular usuario autenticado
      </label>

      <BuenEjemplo isLoggedIn={showLoggedIn} />
      <hr />
      <HookEnBucle />
      <hr />
      <MalEjemplo isLoggedIn={showLoggedIn} />
      <HookEnFuncionAnidada />
    </div>
  );
}
