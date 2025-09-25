import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setToken(parsed.token)
        setUser(parsed.user)
      } catch {}
    }
  }, [])

  const login = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem('auth', JSON.stringify({ token: nextToken, user: nextUser }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth')
  }

  const value = useMemo(() => ({ token, user, login, logout }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


