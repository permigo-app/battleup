import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

export function useGroup(groupId) {
  const [members, setMembers] = useState([])
  const [entries, setEntries] = useState([])
  const [group, setGroup] = useState(null)
  // Unique suffix per mount prevents duplicate channel names during navigation
  const suffix = useRef(Math.random().toString(36).slice(2, 8))
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (!groupId) return

    fetchAll()

    const channel = supabase
      .channel(`group-${groupId}-${suffix.current}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAll)
      .subscribe()

    return () => {
      mounted.current = false
      supabase.removeChannel(channel)
    }
  }, [groupId])

  async function fetchAll() {
    if (!groupId) return
    try {
      const { data: grp } = await supabase.from('groups').select('*').eq('id', groupId).single()
      const { data: usr } = await supabase.from('users').select('*').eq('group_id', groupId)
      const userIds = (usr || []).map(u => u.id)
      const { data: ent } = userIds.length > 0
        ? await supabase.from('entries').select('*').in('user_id', userIds)
        : { data: [] }

      if (!mounted.current) return
      setGroup(grp ?? null)
      setMembers(usr ?? [])
      setEntries(ent ?? [])
    } catch (err) {
      console.error('useGroup fetchAll error:', err)
    }
  }

  const getRanking = () =>
    members.map(m => {
      const total = entries.filter(e => e.user_id === m.id).reduce((s, e) => s + e.count, 0)
      const today = new Date().toISOString().slice(0, 10)
      const todayEntry = entries.find(e => e.user_id === m.id && e.date === today)
      return { ...m, total, today: todayEntry?.count ?? 0 }
    }).sort((a, b) => b.total - a.total)

  const getUserEntries = (userId) => (userId ? entries.filter(e => e.user_id === userId) : [])

  return { group, members, entries, getRanking, getUserEntries, refetch: fetchAll }
}
