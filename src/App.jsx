import './App.css'
import AppRoutes from './routes/AppRoute.jsx'
import { AuthProvider } from '@contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App