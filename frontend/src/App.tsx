import { MoveProvider } from './features/move/context'
import { MoveView } from './features/move/views'

export default function App() {
  return (
    <MoveProvider>
      <MoveView />
    </MoveProvider>
  )
}
