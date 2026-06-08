// ─── Challenge catalog (3-step picker) ────────────────────────────────────────
export const CHALLENGE_CATALOG = [
  {
    key: 'sport',
    label: 'SPORT',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    count: 18,
    subCategories: [
      { key: 'haut_corps',   label: 'Haut du corps',       icon: '💪', challenges: ['pompes','tractions','dips'] },
      { key: 'bas_corps',    label: 'Bas du corps',         icon: '🦵', challenges: ['squats','fentes','mollets'] },
      { key: 'core',         label: 'Core / Abdos',         icon: '🔥', challenges: ['abdos','planche','gainage_lateral'] },
      { key: 'cardio',       label: 'Cardio & Endurance',   icon: '🏃', challenges: ['burpees','course','velo','marche','natation','pas','corde'] },
      { key: 'corps_entier', label: 'Corps entier',         icon: '🏋️', challenges: ['calories','minutes_sport','kg_perdus'] },
    ],
  },
  {
    key: 'etude',
    label: 'ÉTUDE',
    icon: '📚',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    count: 3,
    subCategories: [
      { key: 'etude_lecture', label: 'Étude & Lecture', icon: '📖', challenges: ['etude','pages'] },
      { key: 'langues',       label: 'Langues',         icon: '🌍', challenges: ['langues'] },
    ],
  },
  {
    key: 'discipline',
    label: 'DISCIPLINE',
    icon: '🎯',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    count: 4,
    subCategories: [
      { key: 'sante_habitudes', label: 'Santé & Habitudes', icon: '💪', challenges: ['sans_alcool','sans_cigarette','eau'] },
      { key: 'finance',         label: 'Finance',           icon: '💰', challenges: ['argent'] },
    ],
  },
]

// ─── Full flat list ────────────────────────────────────────────────────────────
// defiType: 'cumul' (default) | 'streak'
export const CHALLENGE_TYPES = [
  { key: 'pompes',          icon: '💪', label: 'Pompes',               unit: 'pompes',    step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'tractions',       icon: '🏋️', label: 'Tractions',            unit: 'tractions', step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'dips',            icon: '💪', label: 'Dips',                 unit: 'dips',      step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'squats',          icon: '🦵', label: 'Squats',               unit: 'squats',    step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'fentes',          icon: '🦵', label: 'Fentes',               unit: 'fentes',    step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'mollets',         icon: '🦵', label: 'Mollets',              unit: 'reps',      step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'abdos',           icon: '🔥', label: 'Abdos',                unit: 'abdos',     step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'planche',         icon: '🔥', label: 'Planche',              unit: 'sec',       step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'gainage_lateral', icon: '🔥', label: 'Gainage latéral',      unit: 'sec',       step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'burpees',         icon: '💥', label: 'Burpees',              unit: 'burpees',   step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'course',          icon: '🏃', label: 'Kilomètres en course', unit: 'km',        step: 0.1,  isDecimal: true,  defiType: 'cumul'   },
  { key: 'velo',            icon: '🚴', label: 'Kilomètres à vélo',    unit: 'km',        step: 0.1,  isDecimal: true,  defiType: 'cumul'   },
  { key: 'marche',          icon: '🚶', label: 'Kilomètres à pied',    unit: 'km',        step: 0.1,  isDecimal: true,  defiType: 'cumul'   },
  { key: 'natation',        icon: '🏊', label: 'Longueurs piscine',    unit: 'longueurs', step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'pas',             icon: '👣', label: 'Nombre de pas',        unit: 'pas',       step: 100,  isDecimal: false, defiType: 'cumul'   },
  { key: 'corde',           icon: '🪢', label: 'Corde à sauter',       unit: 'sauts',     step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'calories',        icon: '🔥', label: 'Calories brûlées',     unit: 'kcal',      step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'minutes_sport',   icon: '⏱️', label: 'Minutes de sport',     unit: 'min',       step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'kg_perdus',       icon: '⚖️', label: 'Kilogrammes perdus',   unit: 'kg',        step: 0.1,  isDecimal: true,  defiType: 'cumul'   },
  { key: 'etude',           icon: '📖', label: "Temps d'étude",        unit: 'min',       step: 5,    isDecimal: false, defiType: 'cumul'   },
  { key: 'pages',           icon: '📚', label: 'Pages lues',           unit: 'pages',     step: 1,    isDecimal: false, defiType: 'cumul'   },
  { key: 'langues',         icon: '🌍', label: 'Pratique de langue',   unit: 'min',       step: 5,    isDecimal: false, defiType: 'cumul'   },
  { key: 'sans_alcool',     icon: '🚫', label: 'Jours sans alcool',    unit: 'jours',     step: 1,    isDecimal: false, defiType: 'streak'  },
  { key: 'sans_cigarette',  icon: '🚭', label: 'Jours sans cigarette', unit: 'jours',     step: 1,    isDecimal: false, defiType: 'streak'  },
  { key: 'eau',             icon: '💧', label: 'Litres d\'eau par jour',unit: 'litres',    step: 0.1,  isDecimal: true,  defiType: 'cumul'   },
  { key: 'argent',          icon: '💰', label: 'Argent gagné',         unit: '€',         step: 1,    isDecimal: false, defiType: 'cumul'   },
]

// ─── Images w=400 (Home big card) ─────────────────────────────────────────────
export const CHALLENGE_IMAGES = {
  pompes:         'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  tractions:      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  dips:           'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
  squats:         'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  fentes:         'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80',
  mollets:        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  abdos:          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  planche:        'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&q=80',
  gainage_lateral:'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&q=80',
  burpees:        'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&q=80',
  course:         'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
  velo:           'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&q=80',
  marche:         'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80',
  natation:       'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80',
  pas:            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  corde:          'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&q=80',
  calories:       'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80',
  minutes_sport:  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  kg_perdus:      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&q=80',
  etude:          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
  pages:          'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',
  langues:        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',
  sans_alcool:    'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80',
  sans_cigarette: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=400&q=80',
  eau:            'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80',
  argent:         'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
}

// ─── Thumbnails w=80 (cards / pickers) ────────────────────────────────────────
export const CHALLENGE_THUMBS = {
  pompes:         'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=80&q=80',
  tractions:      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&q=80',
  dips:           'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=80&q=80',
  squats:         'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=80&q=80',
  fentes:         'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=80&q=80',
  mollets:        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&q=80',
  abdos:          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&q=80',
  planche:        'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=80&q=80',
  gainage_lateral:'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=80&q=80',
  burpees:        'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=80&q=80',
  course:         'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=80&q=80',
  velo:           'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=80&q=80',
  marche:         'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=80&q=80',
  natation:       'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=80&q=80',
  pas:            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&q=80',
  corde:          'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=80&q=80',
  calories:       'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=80&q=80',
  minutes_sport:  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=80&q=80',
  kg_perdus:      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=80&q=80',
  etude:          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=80&q=80',
  pages:          'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=80&q=80',
  langues:        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=80&q=80',
  sans_alcool:    'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=80&q=80',
  sans_cigarette: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=80&q=80',
  eau:            'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&q=80',
  argent:         'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=80&q=80',
}

// ─── Rules ────────────────────────────────────────────────────────────────────
export const CHALLENGE_RULES = {
  pompes:         ['1 pompe = descendre la poitrine jusqu\'au sol, bras tendus en haut.', 'Coudes à 45° du corps.', 'Corps droit du début à la fin.'],
  tractions:      ['1 traction = partir bras tendus, monter jusqu\'au menton au-dessus de la barre.', 'Redescendre complètement avant chaque rep.', 'Tous les styles de prise acceptés.'],
  dips:           ['1 dip = descendre jusqu\'à 90° aux coudes, remonter bras tendus.', 'Utilise une chaise ou des barres parallèles.', 'Corps légèrement penché en avant.'],
  squats:         ['1 squat = cuisses parallèles au sol, puis remonter.', 'Dos droit, pieds à largeur d\'épaules.', 'Genoux ne dépassent pas les orteils.'],
  fentes:         ['1 fente = un pas en avant, genou arrière proche du sol, revenir.', 'Alterne les jambes.', 'Dos droit, regard vers l\'avant.'],
  mollets:        ['1 rep = monter sur la pointe des pieds, tenir 1 sec, redescendre.', 'Dos droit, talon descend complètement entre chaque rep.'],
  abdos:          ['1 abdo = monter les épaules du sol, expirer en montant.', 'Mains derrière la tête sans tirer sur le cou.', 'Bas du dos au sol.'],
  planche:        ['Compte les secondes tenues. Corps droit, abdos contractés.', 'Pas les fesses en l\'air.', 'Appui sur avant-bras ou mains.'],
  gainage_lateral:['Compte les secondes de chaque côté.', 'Corps aligné, hanche décollée du sol.', 'Bras porteur perpendiculaire au sol.'],
  burpees:        ['1 burpee = debout → sol → pompe → pieds vers mains → saut.', 'Pompe complète : poitrine au sol, bras tendus.', 'Saut final visible.'],
  course:         ['Compte uniquement les km courus.', 'La marche rapide ne compte pas.', 'Utilise une app GPS (Strava, Nike Run…).'],
  velo:           ['Km parcourus à vélo uniquement.', 'Vélo classique ou électrique accepté.', 'App GPS conseillée (Strava, Komoot…).'],
  marche:         ['Km à pied uniquement.', 'Utilise ton téléphone ou une montre.', 'Randonnée, balades, trajets quotidiens comptent.'],
  natation:       ['1 longueur = aller simple dans la piscine.', 'Tous les styles de nage acceptés.', 'Piscine extérieure ou intérieure.'],
  pas:            ['Compte le total de pas par jour.', 'App Santé ou montre connectée.', 'Tous les pas du quotidien comptent.'],
  corde:          ['Compte chaque saut — les deux pieds décollent.', 'Les doubles-tours comptent comme 1 saut.', 'Repart à zéro si tu rates.'],
  calories:       ['Utilise ta montre ou l\'app Santé.', 'Additionne les calories de toutes tes activités.', 'Les estimations manuelles sont acceptées.'],
  minutes_sport:  ['Compte le temps d\'effort actif uniquement.', 'Toutes les activités sportives comptent.', 'Utilise un timer ou une app fitness.'],
  kg_perdus:      ['Pèse-toi chaque matin dans les mêmes conditions.', 'Entre uniquement les kg perdus depuis le début du défi.', 'Si tu reprends du poids, entre 0 pour la journée.'],
  etude:          ['Compte le temps de travail actif uniquement.', 'Pauses et distractions ne comptent pas.', 'Timer conseillé (Forest, Toggl…).'],
  pages:          ['Compte les pages complètes lues.', 'Romans, manuels, BD — tout compte.', 'Chaque page tournée = 1 point.'],
  langues:        ['Duolingo, cours, conversation — tout compte si c\'est actif.', 'La télé sans effort ne compte pas.', 'Timer pendant tes sessions.'],
  sans_alcool:    ['Chaque jour sans alcool = +1. Si tu craques, ton compteur repart à zéro.', 'Sois honnête avec toi-même.', 'Le jour où tu craques, appuie sur ❌ dans l\'app.'],
  sans_cigarette: ['Chaque jour sans cigarette = +1. Une seule suffit à tout remettre à zéro.', 'Compter les e-cigarettes aussi.', 'Le jour où tu craques, appuie sur ❌ dans l\'app.'],
  eau:            ['Entre ta consommation totale d\'eau de la journée en litres.', 'Eau, tisanes, thé sans sucre comptent.', 'Café, sodas et alcool ne comptent pas.'],
  argent:         ['Entre l\'argent gagné aujourd\'hui — salaire, freelance, vente.', 'Toutes les sources de revenus comptent.', 'Entre 0 les jours sans revenu.'],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
