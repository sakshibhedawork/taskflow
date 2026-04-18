import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BoardPage from './pages/BoardPage'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/board" element={<ErrorBoundary><BoardPage /></ErrorBoundary>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
