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
  { id: 1, title: 'Reglas Fundamentales', component: ReglasFundamentales },
  { id: 2, title: 'useState', component: UseStateDemo },
  { id: 3, title: 'useEffect', component: UseEffectDemo },
  { id: 4, title: 'useMemo & useCallback', component: OptimizacionRendimiento },
  { id: 5, title: 'useRef', component: UseRefDemo },
  { id: 6, title: 'useContext', component: UseContextDemo },
  { id: 7, title: 'useReducer', component: UseReducerDemo },
  { id: 8, title: 'Custom Hooks', component: CustomHooksDemo },
  { id: 9, title: 'Tips de Certificación', component: TipsCertificacion },
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
          <span className="app-sidebar__subtitle">Topic 7: Hooks</span>
        </h2>

        {temas.map((tema, index) => (
          <button
            key={tema.id}
            onClick={() => setActiveTema(index)}
            className={`app-sidebar__btn ${activeTema === index ? 'app-sidebar__btn--active' : ''}`}
          >
            {tema.id}. {tema.title}
          </button>
        ))}
      </nav>

      <main className="app-content">{ActiveComponent && <ActiveComponent />}</main>
    </div>
  )
}

export default App
