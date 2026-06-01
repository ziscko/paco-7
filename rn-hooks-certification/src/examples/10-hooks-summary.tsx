/**
 * ============================================
 * Hooks Summary
 * ============================================
 *
 * Tabla rápida con los hooks más importantes, cuándo usar cada uno, y un
 * ejemplo corto que te ayuda a recordarlos.
 */

function HooksSummaryTable() {
  return (
    <div className="example-card">
      <h3>Resumen rápido de hooks</h3>
      <div className="table-responsive">
        <table className="table table-dark table-bordered">
          <thead>
            <tr className="table-highlight">
              <th>Nombre</th>
              <th>Función</th>
              <th>Aplicaciones</th>
              <th>Ejemplo corto</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-highlight">
              <td>useState</td>
              <td>Estado local</td>
              <td>formularios, toggles</td>
              <td>
                <code>const [x,setX]=useState(0)</code>
              </td>
            </tr>
            <tr>
              <td>useReducer</td>
              <td>Estado complejo</td>
              <td>lógica de transición, objetos</td>
              <td>
                <code>{'const [state,dispatch]=useReducer(reducer,init)'}</code>
              </td>
            </tr>
            <tr className="table-highlight">
              <td>useEffect</td>
              <td>Sincronizar efectos</td>
              <td>fetch, listeners, cleanup</td>
              <td>
                <code>{'useEffect(() => {...}, [deps])'}</code>
              </td>
            </tr>
            <tr>
              <td>useLayoutEffect</td>
              <td>Medir DOM</td>
              <td>lecturas del layout sin parpadeo</td>
              <td>
                <code>{'useLayoutEffect(() => {...}, [deps])'}</code>
              </td>
            </tr>
            <tr>
              <td>useInsertionEffect</td>
              <td>Insertar estilos</td>
              <td>CSS-in-JS, librerías de estilos</td>
              <td>
                <code>{'useInsertionEffect(() => {...}, [])'}</code>
              </td>
            </tr>
            <tr className="table-highlight">
              <td>useRef</td>
              <td>Valor mutable</td>
              <td>DOM, ids, contadores</td>
              <td>
                <code>const ref=useRef(null)</code>
              </td>
            </tr>
            <tr className="table-highlight">
              <td>useMemo</td>
              <td>Valores cacheados</td>
              <td>Cálculos caros</td>
              <td>
                <code>{'useMemo(() => sum(items), [items])'}</code>
              </td>
            </tr>
            <tr className="table-highlight">
              <td>useCallback</td>
              <td>Funciones memo</td>
              <td>handlers memoizados</td>
              <td>
                <code>{'useCallback(() => doIt(), [deps])'}</code>
              </td>
            </tr>
            <tr className="table-highlight">
              <td>useContext</td>
              <td>Consumir contexto</td>
              <td>tema, auth, settings</td>
              <td>
                <code>const auth=useContext(AuthCtx)</code>
              </td>
            </tr>
            <tr>
              <td>useTransition</td>
              <td>Actualizaciones no urgentes</td>
              <td>interfaz fluida</td>
              <td>
                <code>{'const [isPending,start]=useTransition()'}</code>
              </td>
            </tr>
            <tr>
              <td>useDeferredValue</td>
              <td>Valor diferido</td>
              <td>búsquedas, inputs rápidos</td>
              <td>
                <code>{'const deferred=useDeferredValue(value)'}</code>
              </td>
            </tr>
            <tr>
              <td>useId</td>
              <td>IDs únicos</td>
              <td>accesibilidad, SSR</td>
              <td>
                <code>const id=useId()</code>
              </td>
            </tr>
            <tr>
              <td>useSyncExternalStore</td>
              <td>Suscripción segura</td>
              <td>estado externo, librerías</td>
              <td>
                <code>{'useSyncExternalStore(subscribe,getSnapshot)'}</code>
              </td>
            </tr>
            <tr>
              <td>use</td>
              <td>Leer recursos</td>
              <td>Promises, datos condicionales</td>
              <td>
                <code>{'const data=use(promise)'}</code>
              </td>
            </tr>
            <tr>
              <td>useActionState</td>
              <td>Estado de acción</td>
              <td>formularios asíncronos</td>
              <td>
                <code>{'const action=useActionState(action)'}</code>
              </td>
            </tr>
            <tr>
              <td>useFormStatus</td>
              <td>Estado de formulario</td>
              <td>envíos pendientes</td>
              <td>
                <code>{'const status=useFormStatus()'}</code>
              </td>
            </tr>
            <tr>
              <td>useOptimistic</td>
              <td>Actualizaciones optimistas</td>
              <td>UI reactiva durante async</td>
              <td>
                <code>{'const [state,tryUpdate]=useOptimistic(...)'}</code>
              </td>
            </tr>
            <tr className="table-highlight">
              <td>Custom Hooks</td>
              <td>Reusar lógica</td>
              <td>fetch, formularios, estado</td>
              <td>
                <code>{'function useAuth(){...}'}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function HooksSummary() {
  return (
    <div>
      <h2 className="mb-4">Hooks Summary</h2>

      <div className="example-card mb-3">
        <p>
          Esta lección pone todos los hooks más importantes en una sola tabla. Así podrás comparar
          rápidamente su propósito, cuándo conviene usarlos y cómo se ven en código.
        </p>
        <p className="text-muted small mb-0">Leer: React Documentation {'>'} Hooks Overview</p>
      </div>

      <HooksSummaryTable />

      <div className="example-card mt-3">
        <h3>¿Cuál debes usar?</h3>
        <p className="text-muted small">
          Usa <code>useState</code> para estado local, <code>useEffect</code> para sincronizar con
          el exterior, <code>useRef</code> cuando necesites una referencia mutable y
          <code>useMemo</code>/<code>useCallback</code> para evitar cálculos o renders extra.
        </p>
      </div>
    </div>
  )
}
