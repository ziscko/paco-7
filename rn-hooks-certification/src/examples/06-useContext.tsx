/**
 * ============================================
 * TEMA 6: Estado Global con useContext
 * ============================================
 *
 * useContext permite compartir datos como temas, autenticación
 * o configuración de usuario sin pasar props por cada nivel del árbol.
 *
 * Elimina el "Prop Drilling".
 */

import { createContext, useContext, useState, type ReactNode } from 'react'

// ─── Theme Context ────────────────────────────────────────────

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className={`p-3 border-bottom border-secondary ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}
    >
      <h4 className="mb-1">🎨 Header (usa useContext)</h4>
      <p className="mb-2">
        Tema actual: <strong>{theme}</strong>
      </p>
      <button className="btn btn-outline-info btn-sm" onClick={toggleTheme}>
        Cambiar a {theme === 'dark' ? 'light' : 'dark'}
      </button>
    </header>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className={`example-card ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <h4 className="text-accent">{title}</h4>
      {children}
    </div>
  )
}

function Content() {
  return (
    <div className="p-3">
      <Card title="Card 1">
        <p>Este componente accede al tema sin recibir props.</p>
      </Card>
      <Card title="Card 2">
        <p className="text-accent">El color primario viene del Context.</p>
      </Card>
    </div>
  )
}

// ─── Auth Context ─────────────────────────────────────────────

interface AuthContextType {
  user: string | null
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const login = (name: string) => setUser(name)
  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

function AuthStatus() {
  const { user, login, logout } = useAuth()

  return (
    <div className="example-card">
      <h4>Auth Context</h4>
      {user ? (
        <>
          <p>
            👤 Bienvenido, <strong>{user}</strong>
          </p>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <p>No autenticado</p>
          <button className="btn btn-outline-success btn-sm" onClick={() => login('Developer')}>
            Iniciar sesión
          </button>
        </>
      )}
    </div>
  )
}

export default function UseContextDemo() {
  return (
    <div>
      <h2 className="mb-4">Tema 6: Estado Global con useContext</h2>
      <p className="mb-4">
        Comparte datos sin pasar props por cada nivel del árbol (0 Prop Drilling).
      </p>

      <div className="example-card mb-3">
        <h3>1. Ejemplo: Theme Context</h3>
        <ThemeProvider>
          <Header />
          <Content />
        </ThemeProvider>
      </div>

      <div className="mb-3">
        <h3>2. Ejemplo: Auth Context</h3>
        <AuthProvider>
          <AuthStatus />
        </AuthProvider>
      </div>

      <div className="example-card">
        <h3>3. Patrón recomendado</h3>
        <pre className="code-block">
          {`// 1. Crear Context
const MyContext = createContext<Type | undefined>(undefined)

// 2. Custom Hook seguro
function useMyContext() {
  const ctx = useContext(MyContext)
  if (!ctx) throw new Error("Falta el Provider")
  return ctx
}

// 3. Provider con estado
function MyProvider({ children }) {
  const [state, setState] = useState(initial)
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  )
}

// 4. Consumir en cualquier nivel
function DeepChild() {
  const { state } = useMyContext() // ✅ Sin prop drilling
}`}
        </pre>
      </div>
    </div>
  )
}
