const MEDALS = ['🥇', '🥈', '🥉']

export default function RankingList({ members, entries, highlightUserId }) {
  const ranked = members
    .map(member => ({
      ...member,
      total: entries
        .filter(e => e.user_id === member.id)
        .reduce((sum, e) => sum + e.count, 0),
    }))
    .sort((a, b) => b.total - a.total)

  if (ranked.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-4">Aucun membre pour l'instant.</p>
  }

  return (
    <ul className="space-y-2">
      {ranked.map((member, i) => (
        <li
          key={member.id}
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            member.id === highlightUserId
              ? 'bg-indigo-50 border-indigo-200'
              : 'bg-white border-gray-100'
          }`}
        >
          <span className="text-xl w-7 text-center shrink-0">
            {MEDALS[i] ?? (
              <span className="text-sm text-gray-400 font-semibold">{i + 1}</span>
            )}
          </span>
          <span className="flex-1 font-medium text-gray-800 truncate">{member.pseudo}</span>
          <span className="font-bold text-indigo-600 tabular-nums">
            {member.total.toLocaleString('fr-FR')}
          </span>
          <span className="text-gray-400 text-xs shrink-0">pompes</span>
        </li>
      ))}
    </ul>
  )
}
