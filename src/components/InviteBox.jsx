import { useState } from 'react'

export default function InviteBox({ code, groupName }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    const text = `Rejoins mon groupe "${groupName}" sur Push Challenge !\nCode : ${code}`
    if (navigator.share) {
      await navigator.share({ title: 'Push Challenge', text })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="space-y-3">
      <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
        <p className="text-sm font-semibold text-indigo-500 mb-2">Code du groupe</p>
        <p className="text-5xl font-black tracking-[0.25em] text-indigo-700 font-mono">{code}</p>
        <p className="text-xs text-indigo-400 mt-2">{groupName}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-colors ${
            copied
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? '✓ Copié !' : '📋 Copier'}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          📨 Partager
        </button>
      </div>
    </div>
  )
}
