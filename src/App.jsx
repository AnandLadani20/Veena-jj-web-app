import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Plans from './pages/Plans.jsx'
import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { useMemo } from 'react'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const theme = useMemo(() => createTheme(), [])
  const { token, logout } = useAuth() || {}
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Veena JJ </Typography>
            {token ? (
              <Button color="inherit" onClick={logout}>Logout</Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <div style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<PrivateRoute><Plans /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/success" element={<PrivateRoute><Success /></PrivateRoute>} />
            <Route path="/failure" element={<PrivateRoute><Failure /></PrivateRoute>} /> */}
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
