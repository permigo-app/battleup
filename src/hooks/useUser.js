import { useState, useEffect } from 'react'

export function useUser() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('battleup_user')
    return saved ? JSON.parse(saved) : null
  })

  const saveUser = (userData) => {
    localStorage.setItem('battleup_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('battleup_user')
    setUser(null)
  }

  return { user, saveUser, logout }
}
