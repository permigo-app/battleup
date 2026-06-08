import { useState, useEffect } from 'react'

export function useUser() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('levelup_user')
    return saved ? JSON.parse(saved) : null
  })

  const saveUser = (userData) => {
    localStorage.setItem('levelup_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('levelup_user')
    setUser(null)
  }

  return { user, saveUser, logout }
}
