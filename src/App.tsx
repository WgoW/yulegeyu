import { Route, Routes } from 'react-router-dom'
import Index from '@/pages/Index'
import Game from '@/pages/Game.tsx'
import Config from '@/pages/Config.tsx'
import Layout from '@/pages/Layout.tsx'

function App() {
  return (
    <div className="max-w-md mx-auto bg-transparent">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="game" element={<Game />} />
          <Route path="config" element={<Config />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
