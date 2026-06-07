export const CHALLENGE_TYPES = [
  { key: 'pompes',   icon: '💪', label: 'Pompes',                unit: 'pompes', step: 1,    isDecimal: false },
  { key: 'pas',      icon: '👣', label: 'Nombre de pas',         unit: 'pas',    step: 100,  isDecimal: false },
  { key: 'marche',   icon: '🚶', label: 'Kilomètres à pied',     unit: 'km',     step: 0.1,  isDecimal: true  },
  { key: 'velo',     icon: '🚴', label: 'Kilomètres à vélo',     unit: 'km',     step: 0.1,  isDecimal: true  },
  { key: 'natation', icon: '🏊', label: 'Longueurs piscine',     unit: 'km',     step: 0.01, isDecimal: true  },
  { key: 'squats',   icon: '🦵', label: 'Squats',                unit: 'squats', step: 1,    isDecimal: false },
  { key: 'abdos',    icon: '🔥', label: 'Abdos',                 unit: 'abdos',  step: 1,    isDecimal: false },
  { key: 'tractions',icon: '🏋️', label: 'Tractions',             unit: 'tractions', step: 1, isDecimal: false },
  { key: 'burpees',  icon: '💥', label: 'Burpees',               unit: 'burpees',step: 1,    isDecimal: false },
  { key: 'course',   icon: '🏃', label: 'Kilomètres en course',  unit: 'km',     step: 0.1,  isDecimal: true  },
  { key: 'etude',    icon: '📖', label: "Temps d'étude",         unit: 'min',    step: 5,    isDecimal: false },
]

export const CHALLENGE_RULES = {
  pompes: [
    '1 pompe = descendre la poitrine jusqu\'au sol, bras tendus en haut.',
    'Coudes à 45° du corps, ni trop écartés ni trop serrés.',
    'Corps droit du début à la fin — gainage actif.',
  ],
  squats: [
    '1 squat = descendre jusqu\'à ce que les cuisses soient parallèles au sol, puis remonter.',
    'Dos droit, pieds écartés à la largeur des épaules.',
    'Les genoux ne doivent pas dépasser les orteils.',
  ],
  abdos: [
    '1 abdo = monter les épaules du sol, expirer en montant.',
    'Mains derrière la tête sans tirer sur le cou.',
    'Le bas du dos reste en contact avec le sol.',
  ],
  tractions: [
    '1 traction = partir bras tendus, monter jusqu\'au menton au-dessus de la barre.',
    'Redescendre complètement avant chaque répétition.',
    'Tous les styles de prise sont acceptés (supination, pronation).',
  ],
  burpees: [
    '1 burpee = position debout → descendre au sol → pompe → sauter les pieds vers les mains → saut en hauteur avec les mains en l\'air.',
    'La pompe doit être complète : poitrine au sol, bras tendus.',
    'Le saut final doit être clairement visible.',
  ],
  marche: [
    'Compte uniquement les kilomètres parcourus à pied.',
    'Utilise ton téléphone ou une montre connectée pour mesurer.',
    'La randonnée, les balades et les trajets quotidiens comptent.',
  ],
  velo: [
    'Compte uniquement les kilomètres parcourus à vélo.',
    'Vélo classique ou électrique accepté.',
    'Utilise une application GPS pour mesurer (Strava, Komoot…).',
  ],
  course: [
    'Compte uniquement les kilomètres courus.',
    'La marche rapide ne compte pas.',
    'Utilise une application GPS pour mesurer (Strava, Nike Run…).',
  ],
  natation: [
    '1 longueur = aller simple dans la piscine.',
    'Tous les styles de nage sont acceptés.',
    'Piscine extérieure ou intérieure, eau de mer acceptée.',
  ],
  pas: [
    'Compte le nombre total de pas par jour.',
    'Utilise l\'application Santé de ton téléphone ou une montre connectée.',
    'Les pas du quotidien comptent : travail, courses, promenades.',
  ],
  etude: [
    'Compte uniquement le temps de travail actif.',
    'Les pauses et distractions ne comptent pas.',
    'Utilise un timer ou une application de suivi (Forest, Toggl…).',
  ],
}

export function getChallenge(key) {
  return CHALLENGE_TYPES.find(t => t.key === key) ?? CHALLENGE_TYPES[0]
}

export function getRules(key) {
  return CHALLENGE_RULES[key] ?? CHALLENGE_RULES['pompes']
}

export function formatVal(val, key) {
  const c = getChallenge(key)
  if (!c.isDecimal) return Math.round(val).toLocaleString('fr-FR')
  return Number(val).toFixed(1)
}
