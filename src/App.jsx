// src/App.jsx
import AppRoutes from "./routes";

function App() {
  return <AppRoutes />;
}

export default App;
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
