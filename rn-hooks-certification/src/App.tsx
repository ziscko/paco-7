import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import SynchronizingWithEffects from './examples/01-synchronizing-with-effects'
import ReferencingValuesWithRefs from './examples/02-referencing-values-with-refs'
import ManipulatingDOMWithRefs from './examples/03-manipulating-dom-with-refs'
import YouMightNotNeedAnEffect from './examples/04-you-might-not-need-an-effect'
import LifecycleOfReactiveEffects from './examples/05-lifecycle-of-reactive-effects'
import SeparatingEventsFromEffects from './examples/06-separating-events-from-effects'
import RemovingEffectDependencies from './examples/07-removing-effect-dependencies'
import ReusingLogicWithCustomHooks from './examples/08-reusing-logic-with-custom-hooks'

const topics = [
  {
    id: 1,
    slug: 'topic-1',
    title: 'Synchronizing with Effects',
    summary: 'useEffect, sistemas externos, suscripciones, cleanup.',
    component: SynchronizingWithEffects,
  },
  {
    id: 2,
    slug: 'topic-2',
    title: 'Referencing Values with Refs',
    summary: 'useRef para mantener valores sin causar re-renders.',
    component: ReferencingValuesWithRefs,
  },
  {
    id: 3,
    slug: 'topic-3',
    title: 'Manipulating the DOM with Refs',
    summary: 'useRef para acceder y manipular elementos del DOM.',
    component: ManipulatingDOMWithRefs,
  },
  {
    id: 4,
    slug: 'topic-4',
    title: 'You Might Not Need an Effect',
    summary: 'Cuándo evitar Effects y derivar estado durante el rendering.',
    component: YouMightNotNeedAnEffect,
  },
  {
    id: 5,
    slug: 'topic-5',
    title: 'Lifecycle of Reactive Effects',
    summary: 'Ciclo de vida del Effect, dependencias y re-sincronización.',
    component: LifecycleOfReactiveEffects,
  },
  {
    id: 6,
    slug: 'topic-6',
    title: 'Separating Events from Effects',
    summary: 'Lógica reactiva vs no-reactiva, event handlers vs Effects.',
    component: SeparatingEventsFromEffects,
  },
  {
    id: 7,
    slug: 'topic-7',
    title: 'Removing Effect Dependencies',
    summary: 'Evitar dependencias innecesarias y loops infinitos.',
    component: RemovingEffectDependencies,
  },
  {
    id: 8,
    slug: 'topic-8',
    title: 'Reusing Logic with Custom Hooks',
    summary: 'Extraer y compartir lógica con estado entre componentes.',
    component: ReusingLogicWithCustomHooks,
  },
]

function App() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeIndex = topics.findIndex((t) => t.slug === slug)
  if (activeIndex === -1) {
    return <Navigate to={`/${topics[0].slug}`} replace />
  }

  const ActiveComponent = topics[activeIndex].component

  return (
    <div className="app-layout">
      <nav className={`app-sidebar ${sidebarOpen ? '' : 'app-sidebar--collapsed'}`}>
        <div className="app-sidebar__header">
          {sidebarOpen ? (
            <h2 className="app-sidebar__title">
              🎓 RN Certification
              <br />
              <span className="app-sidebar__subtitle">Chapter 7: Hooks</span>
            </h2>
          ) : null}
          <button
            className="app-sidebar__toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title={sidebarOpen ? 'Contraer' : 'Expandir'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {topics.map((topic, index) => (
          <button
            key={topic.id}
            onClick={() => navigate(`/${topic.slug}`)}
            className={`app-sidebar__btn ${activeIndex === index ? 'app-sidebar__btn--active' : ''}`}
            title={!sidebarOpen ? topic.title : undefined}
          >
            {sidebarOpen ? (
              <>
                <span className="d-block">
                  {topic.id}. {topic.title}
                </span>
                <small className="d-block text-muted mt-1">{topic.summary}</small>
              </>
            ) : (
              <span className="app-sidebar__num">{topic.id}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="app-content">
        <ActiveComponent />
      </div>
    </div>
  )
}

export default App
