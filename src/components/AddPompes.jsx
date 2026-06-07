import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const PRESETS = [10, 20, 30, 50]
const TODAY = new Date().toISOString().split('T')[0]

export default function AddPompes({ userId, onUpdate }) {
  const [todayCount, setTodayCount] = useState(0)
  const [input, setInput] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('entries')
      .select('count')
      .eq('user_id', userId)
      .eq('date', TODAY)
      .maybeSingle()
      .then(({ data }) => setTodayCount(data?.count ?? 0))
  }, [userId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (input <= 0) return
    setLoading(true)

    const newTotal = todayCount + input
    await supabase.from('entries').upsert(
      { user_id: userId, date: TODAY, count: newTotal },
      { onConflict: 'user_id,date' }
    )

    setTodayCount(newTotal)
    setInput(0)
    setLoading(false)
    onUpdate?.()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-1">Aujourd'hui</p>
        <p className="text-6xl font-black text-indigo-600 tabular-nums">{todayCount}</p>
        <p className="text-sm text-gray-400">pompes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2 justify-center flex-wrap">
          {PRESETS.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setInput(v => v + n)}
              className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors"
            >
              +{n}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setInput(v => Math.max(0, v - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors shrink-0"
          >
            −
          </button>
          <input
            type="number"
            min="0"
            value={input}
            onChange={e => setInput(Math.max(0, parseInt(e.target.value) || 0))}
            className="flex-1 text-center text-2xl font-bold border border-gray-200 rounded-xl py-2 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="button"
            onClick={() => setInput(v => v + 1)}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors shrink-0"
          >
            +
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || input === 0}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors"
        >
          {loading ? '…' : input > 0 ? `Ajouter ${input} pompes` : 'Ajouter des pompes'}
        </button>
      </form>
    </div>
  )
}
