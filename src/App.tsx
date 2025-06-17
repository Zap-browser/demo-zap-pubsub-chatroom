import { Toaster } from "@/components/ui/sonner"
import './App.css'
// import Graph3DView from './GraphView'
import ChatRoom from './ChatRoom.tsx'

function App() {
  return (
    <>
      {/* <Graph3DView /> */}
      <ChatRoom />
      <Toaster />
    </>
  )
}

export default App
