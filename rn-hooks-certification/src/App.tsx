import { useState } from "react";
import ReglasFundamentales from "./examples/01-reglas-fundamentales";
import UseStateDemo from "./examples/02-useState";
import UseEffectDemo from "./examples/03-useEffect";
import OptimizacionRendimiento from "./examples/04-useMemo-useCallback";
import UseRefDemo from "./examples/05-useRef";
import UseContextDemo from "./examples/06-useContext";
import UseReducerDemo from "./examples/07-useReducer";
import CustomHooksDemo from "./examples/08-custom-hooks";
import TipsCertificacion from "./examples/09-tips-certificacion";

const temas = [
  { id: 1, title: "Reglas Fundamentales", component: ReglasFundamentales },
  { id: 2, title: "useState", component: UseStateDemo },
  { id: 3, title: "useEffect", component: UseEffectDemo },
  { id: 4, title: "useMemo & useCallback", component: OptimizacionRendimiento },
  { id: 5, title: "useRef", component: UseRefDemo },
  { id: 6, title: "useContext", component: UseContextDemo },
  { id: 7, title: "useReducer", component: UseReducerDemo },
  { id: 8, title: "Custom Hooks", component: CustomHooksDemo },
  { id: 9, title: "Tips de Certificación", component: TipsCertificacion },
];

function App() {
  const [activeTema, setActiveTema] = useState(0);
  const ActiveComponent = temas[activeTema]?.component;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: 260,
          padding: "1rem",
          background: "#0d1117",
          borderRight: "1px solid #30363d",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            color: "#4fc3f7",
            fontSize: "1.1rem",
            marginBottom: "1.5rem",
          }}
        >
          🎓 RN Certification
          <br />
          <span style={{ fontSize: "0.8rem", color: "#8b949e" }}>
            Topic 7: Hooks
          </span>
        </h2>

        {temas.map((tema, index) => (
          <button
            key={tema.id}
            onClick={() => setActiveTema(index)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.6rem 0.8rem",
              marginBottom: "0.3rem",
              textAlign: "left",
              background: activeTema === index ? "#1f6feb33" : "transparent",
              color: activeTema === index ? "#4fc3f7" : "#c9d1d9",
              border:
                activeTema === index
                  ? "1px solid #1f6feb"
                  : "1px solid transparent",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {tema.id}. {tema.title}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          background: "#161b22",
          color: "#c9d1d9",
          overflowY: "auto",
        }}
      >
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}

export default App;
