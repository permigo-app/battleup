import { useState } from 'react'

const STEPS = [
  {
    title: 'Position de départ',
    desc: "Corps gainé, mains à largeur d'épaules, bras tendus. Regard vers le sol.",
    color: 'bg-indigo-50',
    // arms straight, body flat
    svg: (
      <g stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <circle cx="170" cy="28" r="11" fill="#4f46e5" />
        <line x1="160" y1="37" x2="132" y2="58" />
        <line x1="132" y1="58" x2="30" y2="58" />
        <line x1="132" y1="58" x2="122" y2="82" />
        <line x1="122" y1="82" x2="112" y2="98" />
        <line x1="30" y1="58" x2="20" y2="82" />
        <line x1="20" y1="82" x2="10" y2="98" />
        <line x1="160" y1="37" x2="148" y2="62" />
        <line x1="148" y1="62" x2="132" y2="76" />
      </g>
    ),
  },
  {
    title: 'Descente contrôlée',
    desc: 'Fléchissez les coudes à ~45°. Inspirez lentement, dos strictement droit.',
    color: 'bg-blue-50',
    svg: (
      <g stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <circle cx="158" cy="36" r="11" fill="#4f46e5" />
        <line x1="148" y1="45" x2="118" y2="70" />
        <line x1="118" y1="70" x2="30" y2="66" />
        <line x1="118" y1="70" x2="110" y2="93" />
        <line x1="110" y1="93" x2="100" y2="108" />
        <line x1="30" y1="66" x2="20" y2="89" />
        <line x1="20" y1="89" x2="10" y2="108" />
        <line x1="148" y1="45" x2="122" y2="65" />
        <line x1="122" y1="65" x2="102" y2="57" />
      </g>
    ),
  },
  {
    title: 'Point bas',
    desc: 'Poitrine à ~5 cm du sol. Abdos contractés, hanches alignées.',
    color: 'bg-violet-50',
    svg: (
      <g stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <circle cx="148" cy="46" r="11" fill="#4f46e5" />
        <line x1="138" y1="55" x2="102" y2="78" />
        <line x1="102" y1="78" x2="30" y2="76" />
        <line x1="102" y1="78" x2="96" y2="100" />
        <line x1="96" y1="100" x2="86" y2="112" />
        <line x1="30" y1="76" x2="20" y2="98" />
        <line x1="20" y1="98" x2="10" y2="112" />
        <line x1="138" y1="55" x2="108" y2="72" />
        <line x1="108" y1="72" x2="90" y2="62" />
      </g>
    ),
  },
  {
    title: 'Poussée explosive',
    desc: 'Expirez en poussant fort. Revenez à la position initiale sans verrouiller les coudes.',
    color: 'bg-indigo-50',
    svg: (
      <g stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <circle cx="170" cy="28" r="11" fill="#4f46e5" />
        <line x1="160" y1="37" x2="132" y2="58" />
        <line x1="132" y1="58" x2="30" y2="58" />
        <line x1="132" y1="58" x2="122" y2="82" />
        <line x1="122" y1="82" x2="112" y2="98" />
        <line x1="30" y1="58" x2="20" y2="82" />
        <line x1="20" y1="82" x2="10" y2="98" />
        <line x1="160" y1="37" x2="148" y2="62" />
        <line x1="148" y1="62" x2="132" y2="76" />
        <line x1="142" y1="22" x2="152" y2="10" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="4 3" />
        <line x1="162" y1="18" x2="172" y2="6" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="4 3" />
      </g>
    ),
  },
]

export default function TechniqueAnim() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <div className="space-y-4">
      <div className={`${current.color} rounded-2xl p-6 flex justify-center transition-colors duration-300`}>
        <svg viewBox="0 0 200 120" className="w-full max-w-xs" aria-hidden="true">
          {current.svg}
        </svg>
      </div>

      <div className="flex gap-1.5 justify-center">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === step ? 'bg-indigo-600 w-6' : 'bg-gray-300 w-2'
            }`}
            aria-label={`Étape ${i + 1}`}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center min-h-[88px] flex flex-col justify-center">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
          Étape {step + 1} / {STEPS.length}
        </p>
        <p className="font-bold text-gray-800 mb-1">{current.title}</p>
        <p className="text-sm text-gray-500">{current.desc}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm disabled:opacity-30 hover:bg-gray-200 transition-colors"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setStep(s => s + 1)}
          disabled={step === STEPS.length - 1}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm disabled:opacity-30 hover:bg-indigo-700 transition-colors"
        >
          Suivant →
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-1">
        <p className="font-semibold mb-1">À éviter :</p>
        <p>❌ Laisser les hanches s'effondrer</p>
        <p>❌ Verrouiller les coudes en haut</p>
        <p>❌ Lever la tête ou cambrer le dos</p>
      </div>
    </div>
  )
}
