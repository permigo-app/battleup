import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const TODAY = new Date().toISOString().split('T')[0]

function intensity(count) {
  if (!count) return 'bg-gray-100 text-gray-400'
  if (count < 20)  return 'bg-indigo-100 text-indigo-600'
  if (count < 50)  return 'bg-indigo-300 text-white'
  if (count < 100) return 'bg-indigo-500 text-white'
  return 'bg-indigo-700 text-white'
}

export default function HistoryCalendar({ userId }) {
  const [entries, setEntries] = useState([])
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  useEffect(() => {
    if (!userId) return
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`

    supabase
      .from('entries')
      .select('date, count')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end)
      .then(({ data }) => setEntries(data ?? []))
  }, [userId, year, month])

  const entryMap = Object.fromEntries(entries.map(e => [e.date, e.count]))
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const monthLabel = now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-600 capitalize mb-3">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="text-xs text-gray-400 pb-1 font-medium">{d}</span>
        ))}

        {Array.from({ length: firstDay }, (_, i) => <span key={`b${i}`} />)}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const count = entryMap[dateStr]
          const isToday = dateStr === TODAY

          return (
            <div
              key={d}
              title={count ? `${count} pompes` : undefined}
              className={`aspect-square rounded-md flex items-center justify-center text-xs font-semibold
                ${intensity(count)}
                ${isToday ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}
              `}
            >
              {d}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-gray-400">Moins</span>
        {['bg-gray-100', 'bg-indigo-100', 'bg-indigo-300', 'bg-indigo-500', 'bg-indigo-700'].map(c => (
          <span key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-xs text-gray-400">Plus</span>
      </div>
    </div>
  )
}
