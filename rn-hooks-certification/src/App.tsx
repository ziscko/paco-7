import { useState } from 'react'
import SynchronizingWithEffects from './examples/01-synchronizing-with-effects'
import ReferencingValuesWithRefs from './examples/02-referencing-values-with-refs'
import ManipulatingDOMWithRefs from './examples/03-manipulating-dom-with-refs'
import YouMightNotNeedAnEffect from './examples/04-you-might-not-need-an-effect'
import LifecycleOfReactiveEffects from './examples/05-lifecycle-of-reactive-effects'
import SeparatingEventsFromEffects from './examples/06-separating-events-from-effects'
import RemovingEffectDependencies from './examples/07-removing-effect-dependencies'
import ReusingLogicWithCustomHooks from './examples/08-reusing-logic-with-custom-hooks'

const temas = [
  {
    id: 1,
    title: 'Synchronizing with Effects',
    summary: 'useEffect, sistemas externos, suscripciones, cleanup.',
    component: SynchronizingWithEffects,
  },
  {
    id: 2,
    title: 'Referencing Values with Refs',
    summary: 'useRef para mantener valores sin causar re-renders.',
    component: ReferencingValuesWithRefs,
  },
  {
    id: 3,
    title: 'Manipulating the DOM with Refs',
    summary: 'useRef para acceder y manipular elementos del DOM.',
    component: ManipulatingDOMWithRefs,
  },
  {
    id: 4,
    title: 'You Might Not Need an Effect',
    summary: 'Cuándo evitar Effects y derivar estado durante el rendering.',
    component: YouMightNotNeedAnEffect,
  },
  {
    id: 5,
    title: 'Lifecycle of Reactive Effects',
    summary: 'Ciclo de vida del Effect, dependencias y re-sincronización.',
    component: LifecycleOfReactiveEffects,
  },
  {
    id: 6,
    title: 'Separating Events from Effects',
    summary: 'Lógica reactiva vs no-reactiva, event handlers vs Effects.',
    component: SeparatingEventsFromEffects,
  },
  {
    id: 7,
    title: 'Removing Effect Dependencies',
    summary: 'Evitar dependencias innecesarias y loops infinitos.',
    component: RemovingEffectDependencies,
  },
  {
    id: 8,
    title: 'Reusing Logic with Custom Hooks',
    summary: 'Extraer y compartir lógica con estado entre componentes.',
    component: ReusingLogicWithCustomHooks,
  },
]

function App() {
  const [activeTema, setActiveTema] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const ActiveComponent = temas[activeTema]?.component

  return (
    <div className="app-layout">
      <nav className={`app-sidebar ${sidebarOpen ? '' : 'app-sidebar--collapsed'}`}>
        <div className="app-sidebar__header">
          {sidebarOpen && (
            <>
              <h2 className="app-sidebar__title">
                🎓 RN Certification
                <br />
                <span className="app-sidebar__subtitle">Chapter 7: Hooks</span>
              </h2>
              <p className="text-light small mb-3">
                Temas alineados con el syllabus oficial de la certificación.
              </p>
            </>
          )}
          <button
            className="app-sidebar__toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title={sidebarOpen ? 'Contraer' : 'Expandir'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {temas.map((tema, index) => (
          <button
            key={tema.id}
            onClick={() => setActiveTema(index)}
            className={`app-sidebar__btn ${activeTema === index ? 'app-sidebar__btn--active' : ''}`}
            title={!sidebarOpen ? tema.title : undefined}
          >
            {sidebarOpen ? (
              <>
                <span className="d-block">
                  {tema.id}. {tema.title}
                </span>
                <small className="d-block text-muted mt-1">{tema.summary}</small>
              </>
            ) : (
              <span className="app-sidebar__num">{tema.id}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="app-content">{ActiveComponent && <ActiveComponent />}</main>
    </div>
  )
}

export default App
