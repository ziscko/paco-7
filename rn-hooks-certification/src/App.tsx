import { useState } from 'react'
import ReglasFundamentales from './examples/01-reglas-fundamentales'
import UseStateDemo from './examples/02-useState'
import UseEffectDemo from './examples/03-useEffect'
import OptimizacionRendimiento from './examples/04-useMemo-useCallback'
import UseRefDemo from './examples/05-useRef'
import UseContextDemo from './examples/06-useContext'
import UseReducerDemo from './examples/07-useReducer'
import CustomHooksDemo from './examples/08-custom-hooks'
import TipsCertificacion from './examples/09-tips-certificacion'

const temas = [
  {
    id: 1,
    title: 'Hooks',
    summary: 'Reglas y uso correcto de los Hooks en componentes funcionales.',
    component: ReglasFundamentales,
  },
  {
    id: 2,
    title: 'Sincronizando con useEffect',
    summary: 'Efectos secundarios, dependencias, montaje y limpieza.',
    component: UseEffectDemo,
  },
  {
    id: 3,
    title: 'useState',
    summary: 'Estado local, actualizaciones funcionales y estado inicial lazy.',
    component: UseStateDemo,
  },
  {
    id: 4,
    title: 'useMemo & useCallback',
    summary: 'Optimización de rendimiento y memoización de valores y callbacks.',
    component: OptimizacionRendimiento,
  },
  {
    id: 5,
    title: 'useRef',
    summary: 'Referencias persistentes, acceso a nodos y valores sin re-render.',
    component: UseRefDemo,
  },
  {
    id: 6,
    title: 'useContext',
    summary: 'Estado global compartido sin prop drilling.',
    component: UseContextDemo,
  },
  {
    id: 7,
    title: 'useReducer',
    summary: 'Gestión de estado compleja con acciones y reducers.',
    component: UseReducerDemo,
  },
  {
    id: 8,
    title: 'Custom Hooks',
    summary: 'Reutilización de lógica y abstracción de comportamiento.',
    component: CustomHooksDemo,
  },
  {
    id: 9,
    title: 'Tips de Certificación',
    summary: 'Errores frecuentes, closure stale, lazy state e infinite loops.',
    component: TipsCertificacion,
  },
]

function App() {
  const [activeTema, setActiveTema] = useState(0)
  const ActiveComponent = temas[activeTema]?.component

  return (
    <div className="app-layout">
      <nav className="app-sidebar">
        <h2 className="app-sidebar__title">
          🎓 RN Certification
          <br />
          <span className="app-sidebar__subtitle">Temario: Hooks</span>
        </h2>

        <p className="text-light small mb-3">
          Temas organizados exactamente por bloque del syllabus.
        </p>

        {temas.map((tema, index) => (
          <button
            key={tema.id}
            onClick={() => setActiveTema(index)}
            className={`app-sidebar__btn ${activeTema === index ? 'app-sidebar__btn--active' : ''}`}
          >
            <span className="d-block">
              {tema.id}. {tema.title}
            </span>
            <small className="d-block text-muted mt-1">{tema.summary}</small>
          </button>
        ))}
      </nav>

      <main className="app-content">{ActiveComponent && <ActiveComponent />}</main>
    </div>
  )
}

export default App
