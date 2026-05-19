/**
 * ============================================
 * TEMA 6: Estado Global con useContext
 * ============================================
 *
 * useContext permite compartir datos como temas, autenticación
 * o configuración de usuario sin pasar props por cada nivel del árbol.
 *
 * Elimina el "Prop Drilling": pasar props a través de múltiples
 * niveles de componentes intermedios que no los necesitan.
 *
 * Patrón:
 * 1. Crear el Context con createContext
 * 2. Proveer el valor con Context.Provider
 * 3. Consumir con useContext(Context)
 */

import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Paso 1: Crear el Context ─────────────────────────────────

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    primary: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook para consumir el context de forma segura
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
}

// ─── Paso 2: Crear el Provider ────────────────────────────────

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const colors =
    theme === "dark"
      ? {
          background: "#1a1a2e",
          text: "#e0e0e0",
          primary: "#4fc3f7",
          border: "#555",
        }
      : {
          background: "#ffffff",
          text: "#333333",
          primary: "#1976d2",
          border: "#ddd",
        };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Paso 3: Consumir con useContext ──────────────────────────

// Componente profundamente anidado que accede al tema SIN prop drilling
function Header() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <header
      style={{
        padding: "1rem",
        background: colors.background,
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <h4 style={{ margin: 0 }}>🎨 Header (usa useContext)</h4>
      <p>
        Tema actual: <strong>{theme}</strong>
      </p>
      <button onClick={toggleTheme} style={{ color: colors.primary }}>
        Cambiar a {theme === "dark" ? "light" : "dark"}
      </button>
    </header>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        padding: "1rem",
        background: colors.background,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        margin: "0.5rem 0",
      }}
    >
      <h4 style={{ color: colors.primary }}>{title}</h4>
      {children}
    </div>
  );
}

function Content() {
  const { colors } = useTheme();

  return (
    <div style={{ padding: "1rem" }}>
      <Card title="Card 1">
        <p>Este componente accede al tema sin recibir props.</p>
      </Card>
      <Card title="Card 2">
        <p style={{ color: colors.primary }}>
          El color primario viene del Context.
        </p>
      </Card>
    </div>
  );
}

// ─── Ejemplo de Auth Context ──────────────────────────────────

interface AuthContextType {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (name: string) => setUser(name);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AuthStatus() {
  const { user, login, logout } = useAuth();

  return (
    <div style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}>
      <h4>Auth Context</h4>
      {user ? (
        <>
          <p>
            👤 Bienvenido, <strong>{user}</strong>
          </p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <p>No autenticado</p>
          <button onClick={() => login("Developer")}>Iniciar sesión</button>
        </>
      )}
    </div>
  );
}

// ─── Componente principal del tema ────────────────────────────

export default function UseContextDemo() {
  return (
    <div>
      <h2>Tema 6: Estado Global con useContext</h2>
      <p>
        Comparte datos sin pasar props por cada nivel del árbol (0 Prop
        Drilling).
      </p>

      <div
        style={{
          padding: "1rem",
          border: "1px solid #555",
          borderRadius: 8,
          marginBottom: "1rem",
        }}
      >
        <h3>Ejemplo: Theme Context</h3>
        <ThemeProvider>
          <Header />
          <Content />
        </ThemeProvider>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h3>Ejemplo: Auth Context</h3>
        <AuthProvider>
          <AuthStatus />
        </AuthProvider>
      </div>

      <div
        style={{ padding: "1rem", border: "1px solid #555", borderRadius: 8 }}
      >
        <h3>Patrón recomendado</h3>
        <pre
          style={{
            fontSize: "0.85rem",
            background: "#0d1117",
            color: "#c9d1d9",
            padding: "0.5rem",
            borderRadius: 4,
          }}
        >
          {`// 1. Crear Context
const MyContext = createContext<Type | undefined>(undefined);

// 2. Custom Hook seguro
function useMyContext() {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error("Falta el Provider");
  return ctx;
}

// 3. Provider con estado
function MyProvider({ children }) {
  const [state, setState] = useState(initial);
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

// 4. Consumir en cualquier nivel
function DeepChild() {
  const { state } = useMyContext(); // ✅ Sin prop drilling
}`}
        </pre>
      </div>
    </div>
  );
}
