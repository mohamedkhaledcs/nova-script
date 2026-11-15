/**
 * NovaScript Localization Dictionary (English by default, Arabic optional).
 * Comprehensive translation dictionary for all UI panels, HUDs, modals, and gameplay text.
 */

export interface Translations {
  // Navigation & Menu
  enterStation: string;
  startNewMission: string;
  resumeMission: string;
  settings: string;
  profile: string;
  handbook: string;
  about: string;
  back: string;
  saveAndClose: string;
  resetDefaults: string;
  gameTitle: string;
  gameSubtitle: string;
  soundOn: string;
  soundOff: string;
  chooseAstronaut: string;
  alexDesignation: string;
  mayaDesignation: string;
  version: string;
  
  // Minimap & Station Rooms
  stationRadar: string;
  radarSubtitle: string;
  centralHub: string;
  centralHubDesc: string;
  commandCenter: string;
  commandCenterDesc: string;
  vehicleHangar: string;
  vehicleHangarDesc: string;
  scienceLab: string;
  scienceLabDesc: string;
  commsArray: string;
  commsArrayDesc: string;
  resourceBay: string;
  resourceBayDesc: string;
  missionBoard: string;
  missionBoardDesc: string;
  dirCenter: string;
  dirWest: string;
  dirEast: string;
  dirNorthWest: string;
  dirNorthEast: string;
  dirSouthWest: string;
  dirSouthEast: string;
  radarClickHint: string;
  targetWaypoint: string;
  distance: string;
  meters: string;
  
  // HUD
  inventory: string;
  crafting: string;
  hangar: string;
  pause: string;
  interactPrompt: string;
  doubleClickPrompt: string;
  radarToggle: string;
  info: string;
  controlsMove: string;
  controlsInteract: string;
  controlsInventory: string;
  controlsProfile: string;
  controlsRadar: string;
  capacity: string;
  maxCapacity: string;
  
  // Materials & Collectibles
  metalScrap: string;
  metalScrapDesc: string;
  energyCell: string;
  energyCellDesc: string;
  scienceSample: string;
  scienceSampleDesc: string;
  blueprintFragment: string;
  blueprintFragmentDesc: string;
  rareMineral: string;
  rareMineralDesc: string;
  
  // Crafting Workbench
  workbenchTitle: string;
  workbenchSubtitle: string;
  craftUpgrade: string;
  craftedBadge: string;
  insufficientMaterials: string;
  cosmeticUpgradeNotice: string;
  materialsRequired: string;
  
  // Mission Selector
  missionAssignment: string;
  selectTargetTitle: string;
  selectTargetSubtitle: string;
  lunarMissionTitle: string;
  lunarMissionDesc: string;
  marsMissionTitle: string;
  marsMissionDesc: string;
  shorterTransit: string;
  moderateComplexity: string;
  longerTransit: string;
  higherComplexity: string;
  selectMoonButton: string;
  selectMarsButton: string;
  
  // Mini-Games
  antennaTitle: string;
  antennaSubtitle: string;
  antennaFrequency: string;
  antennaSignalStrength: string;
  antennaLock: string;
  antennaLocked: string;
  spectrometerTitle: string;
  spectrometerSubtitle: string;
  spectrometerWavelength: string;
  spectrometerCalibrate: string;
  spectrometerIdentified: string;
  
  // Player Profile
  profileTitle: string;
  commanderPersonnel: string;
  careerStats: string;
  missionsCompleted: string;
  endingsDiscovered: string;
  bestScore: string;
  modulesVisited: string;
  itemsCrafted: string;
  materialsCollected: string;
  suitColorTitle: string;
  resetProgress: string;
  alexBio: string;
  mayaBio: string;
  rankCosmosLegend: string;
  rankArchitect: string;
  rankDirector: string;
  rankSpecialist: string;
  rankCadet: string;
  
  // Settings Tabs
  audioEngine: string;
  graphicsMood: string;
  keybindings: string;
  masterVolume: string;
  musicVolume: string;
  sfxVolume: string;
  
  // Graphics & Moods
  visualModeTitle: string;
  modeCinematic: string;
  modeCinematicDesc: string;
  modeRetro: string;
  modeRetroDesc: string;
  modeCyber: string;
  modeCyberDesc: string;
  modePerf: string;
  modePerfDesc: string;
  
  // Keybindings
  keybindingsDesc: string;
  rebindPrompt: string;
  keyAssigned: string;
  
  // Actions
  actionMoveForward: string;
  actionMoveBackward: string;
  actionMoveLeft: string;
  actionMoveRight: string;
  actionInteract: string;
  actionInventory: string;
  actionProfile: string;
  actionMinimap: string;
  actionHandbook: string;
  actionPause: string;

  // Question & Mission Gameplay
  optionA: string;
  optionB: string;
  chooseOption: string;
  engineeringImpact: string;
  confirmDecision: string;
  sourceText: string;
  scoreLabel: string;
  stageLabel: string;

  // Language
  language: string;

  // Banner, Slogan & About Modal
  bannerSubtitle: string;
  gameSlogan: string;
  educationalDisclaimer: string;
  aboutModalTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutAttribution: string;
  close: string;

  // Visual Mode HUD Badges
  modeBadgeCinematic: string;
  modeBadgeRetro: string;
  modeBadgeCyber: string;
  modeBadgePerf: string;
  cycleVisualModeHint: string;

  // Mission Report & Cinematics
  reportHeaderBadge: string;
  officialScoreLabel: string;
  deterministicFormulaLabel: string;
  outcomeNarrativeTitle: string;
  engineeringRationaleTitle: string;
  educationalTakeawayTitle: string;
  finalReservesTitle: string;
  decisionChronologyTitle: string;
  restartMissionButton: string;
  pointsUnit: string;
  statusCheckingSystems: string;
  statusPropulsionNominal: string;
  statusGuidanceOnline: string;
  statusCountdownInitiated: string;
  statusIgnition: string;
  statusLiftoff: string;
  statusScrubbed: string;
  statusAtmosphericEntry: string;
  statusContactLost: string;
}

export const TRANSLATIONS: Record<'en' | 'ar', Translations> = {
  en: {
    enterStation: 'ENTER STATION',
    startNewMission: 'START NEW MISSION',
    resumeMission: 'RESUME MISSION',
    settings: 'SETTINGS',
    profile: 'PROFILE',
    handbook: 'HANDBOOK',
    about: 'ABOUT',
    back: 'BACK',
    saveAndClose: 'SAVE & CLOSE',
    resetDefaults: 'RESET TO DEFAULTS',
    gameTitle: 'NOVASCRIPT',
    gameSubtitle: 'Deep Space Mission Design Simulator',
    soundOn: 'Audio Enabled',
    soundOff: 'Audio Muted',
    chooseAstronaut: 'SELECT ACTIVE ASTRONAUT',
    alexDesignation: 'ALEX // CDR',
    mayaDesignation: 'MAYA // SPEC',
    version: 'STATION SIMULATOR v2.2 // DEEP SPACE OPS',

    stationRadar: 'STATION RADAR',
    radarSubtitle: 'ACTIVE ORBITAL SWEEP',
    centralHub: 'Central Transit Hub',
    centralHubDesc: 'Central nexus connecting all six orbital station modules',
    commandCenter: 'Command Center',
    commandCenterDesc: 'Flight telemetry, station displays, and observation deck',
    vehicleHangar: 'Vehicle Hangar',
    vehicleHangarDesc: '3D Spacecraft assembly bay & engineering workbench',
    scienceLab: 'Science Laboratory',
    scienceLabDesc: 'Planetary geology research & laser Raman spectrometer',
    commsArray: 'Communications Array',
    commsArrayDesc: 'Deep Space Network antenna station & frequency calibration',
    resourceBay: 'Resource Bay',
    resourceBayDesc: 'Orbital raw materials storage, energy cells & salvage',
    missionBoard: 'Mission Launch Board',
    missionBoardDesc: 'Target trajectory computer & expedition launch console',
    dirCenter: 'CENTER',
    dirWest: 'WEST [W]',
    dirEast: 'EAST [E]',
    dirNorthWest: 'NORTH-WEST [NW]',
    dirNorthEast: 'NORTH-EAST [NE]',
    dirSouthWest: 'SOUTH-WEST [SW]',
    dirSouthEast: 'SOUTH-EAST [SE]',
    radarClickHint: 'CLICK ANY MODULE TO ENGAGE AUTOPILOT NAVIGATION',
    targetWaypoint: 'TARGET WAYPOINT',
    distance: 'DISTANCE',
    meters: 'm',

    inventory: 'Inventory',
    crafting: 'Crafting',
    hangar: 'Hangar',
    pause: 'Pause',
    interactPrompt: '[E] INTERACT',
    doubleClickPrompt: '[E] INTERACT // DOUBLE-CLICK',
    radarToggle: '[M] Hide',
    info: 'HANDBOOK',
    controlsMove: 'WASD / Arrows to Move',
    controlsInteract: '[E] Interact',
    controlsInventory: '[I] Inventory',
    controlsProfile: '[P] Profile',
    controlsRadar: '[M] Radar',
    capacity: 'Capacity',
    maxCapacity: 'MAX CAPACITY',

    metalScrap: 'Metal Scrap',
    metalScrapDesc: 'Salvaged titanium alloy fragments for structural repairs.',
    energyCell: 'Energy Cell',
    energyCellDesc: 'Compact fusion micro-cells powering station subsystems.',
    scienceSample: 'Science Sample',
    scienceSampleDesc: 'Planetary soil and regolith specimens for laser spectrometry.',
    blueprintFragment: 'Blueprint Fragment',
    blueprintFragmentDesc: 'Orbital telemetry schematics for spacecraft upgrades.',
    rareMineral: 'Rare Mineral',
    rareMineralDesc: 'Exotic crystalline silicates with high thermal resistance.',

    workbenchTitle: 'ENGINEERING WORKBENCH',
    workbenchSubtitle: 'Craft aesthetic spacecraft upgrades using salvaged materials.',
    craftUpgrade: 'CRAFT UPGRADE',
    craftedBadge: 'INSTALLED',
    insufficientMaterials: 'INSUFFICIENT MATERIALS',
    cosmeticUpgradeNotice: 'Upgrades customize spacecraft visual components without altering mission formulas.',
    materialsRequired: 'Materials Required:',

    missionAssignment: 'MISSION ASSIGNMENT',
    selectTargetTitle: 'SELECT EXPEDITION TARGET',
    selectTargetSubtitle: 'Choose your flight destination. Each path introduces distinct orbital parameters.',
    lunarMissionTitle: 'LUNAR RECONNAISSANCE',
    lunarMissionDesc: 'Design a robotic probe for Moon exploration. Study lunar geology and test landing technologies.',
    marsMissionTitle: 'MARS EXPEDITION',
    marsMissionDesc: 'Engineer an interplanetary spacecraft to reach Mars. Manage atmospheric entry and search for ancient water.',
    shorterTransit: '3-DAY TRANSIT',
    moderateComplexity: 'MODERATE DELTA-V',
    longerTransit: '7-9 MONTH TRANSIT',
    higherComplexity: 'HIGH THERMAL LOAD',
    selectMoonButton: 'SELECT MOON MISSION',
    selectMarsButton: 'SELECT MARS MISSION',

    antennaTitle: 'DEEP SPACE NETWORK CALIBRATION',
    antennaSubtitle: 'Align the high-gain dish antenna frequency to establish uplink with mission control.',
    antennaFrequency: 'Carrier Frequency',
    antennaSignalStrength: 'Signal Strength',
    antennaLock: 'LOCK SIGNAL',
    antennaLocked: 'SIGNAL LOCKED & CALIBRATED',
    spectrometerTitle: 'RAMAN LASER SPECTROMETER',
    spectrometerSubtitle: 'Calibrate laser excitation wavelength to identify mineral crystal signatures.',
    spectrometerWavelength: 'Laser Wavelength',
    spectrometerCalibrate: 'ANALYZE SAMPLE',
    spectrometerIdentified: 'SIGNATURE IDENTIFIED',

    profileTitle: 'ASTRONAUT FLIGHT RECORD',
    commanderPersonnel: 'STATION COMMAND PERSONNEL',
    careerStats: 'FLIGHT METRICS & CAREER STATS',
    missionsCompleted: 'Missions Completed',
    endingsDiscovered: 'Endings Found',
    bestScore: 'Best Mission Score',
    modulesVisited: 'Modules Explored',
    itemsCrafted: 'Items Crafted',
    materialsCollected: 'Materials Salvaged',
    suitColorTitle: 'EVA SUIT SURFACE COATING',
    resetProgress: 'RESET CAREER DATA',
    alexBio: 'Commander Alex Vance — Senior Aerospace Engineer and Flight Commander with over 4,200 simulated orbital hours.',
    mayaBio: 'Specialist Dr. Maya Lin — Planetary Geologist and Astrobiology Lead, specializing in deep-space spectroscopy.',
    rankCosmosLegend: 'Cosmos Legend',
    rankArchitect: 'Lead Systems Architect',
    rankDirector: 'Flight Operations Director',
    rankSpecialist: 'Mission Specialist',
    rankCadet: 'Cadet Explorer',

    audioEngine: 'AUDIO ENGINE',
    graphicsMood: 'GRAPHICS & MOOD',
    keybindings: 'KEYBOARD CONTROLS',
    masterVolume: 'Master Volume',
    musicVolume: 'Adaptive Soundtrack',
    sfxVolume: 'Sound Effects',

    visualModeTitle: 'STATION RENDERING MOOD',
    modeCinematic: '3D Cinematic Simulation',
    modeCinematicDesc: 'Realistic dynamic lighting, soft specular reflections, starfield depth, and balanced space shadows.',
    modeRetro: '3D Voxel Pixel (Minecraft Style)',
    modeRetroDesc: 'Chunky 3D block cubes, voxel architecture, flat shading, and CRT scanlines.',
    modeCyber: 'Cyberpunk Neon Matrix',
    modeCyberDesc: 'Hyper-saturated electric cyan and magenta luminescence with scanlines and atmospheric bloom.',
    modePerf: 'Tactical Blueprint (Minimalist CAD)',
    modePerfDesc: 'High-visibility CAD blueprint wireframes, lightweight rendering, and ultra-smooth 120 FPS.',

    keybindingsDesc: 'Click any key to rebind it. Multiple keys supported per action.',
    rebindPrompt: 'PRESS ANY KEY TO REBIND...',
    keyAssigned: 'Assigned',

    actionMoveForward: 'Move Forward (North)',
    actionMoveBackward: 'Move Backward (South)',
    actionMoveLeft: 'Move Left (West)',
    actionMoveRight: 'Move Right (East)',
    actionInteract: 'Interact with Consoles & Objects',
    actionInventory: 'Open Materials Inventory',
    actionProfile: 'Open Commander Profile',
    actionMinimap: 'Toggle Station Radar',
    actionHandbook: 'Open Space Handbook',
    actionPause: 'Pause Menu / Close Active',

    optionA: 'OPTION A',
    optionB: 'OPTION B',
    chooseOption: 'CONFIRM CHOICE',
    engineeringImpact: 'ENGINEERING IMPACT:',
    confirmDecision: 'CONFIRM DECISION',
    sourceText: 'NASA Technical Reference',
    scoreLabel: 'Flight Score',
    stageLabel: 'Mission Stage',

    language: 'LANGUAGE / اللغة',

    bannerSubtitle: 'SPACE MISSION DESIGN & OPERATIONS SIMULATOR',
    gameSlogan: '"Design. Decide. Explore."',
    educationalDisclaimer: 'NovaScript is an independent educational space simulation game. It is not an official NASA product, nor is it endorsed by or affiliated with NASA.',
    aboutModalTitle: 'MISSION BRIEFING & CREDITS',
    aboutParagraph1: 'In NovaScript, you are the Mission Commander in charge of designing, launching, and operating an interplanetary robotic spacecraft.',
    aboutParagraph2: 'Explore 31 interconnected systems engineering trade-offs, managing normalized Budget, Mass, Power, Science, and Communication margins.',
    aboutAttribution: 'Attribution: Based on the NASA Space Apps Challenge 2026 Space Mission Design Game and JPL Concept Maturity Level systems engineering methodologies.',
    close: 'CLOSE',

    modeBadgeCinematic: '3D CINEMA',
    modeBadgeRetro: 'VOXEL 3D',
    modeBadgeCyber: 'CYBER NEON',
    modeBadgePerf: 'CAD BLUEPRINT',
    cycleVisualModeHint: 'Cycle Visual Rendering Mode (3D / Voxel / Neon / CAD)',

    reportHeaderBadge: 'FLIGHT COMMISSION // FINAL DEBRIEF DOSSIER',
    officialScoreLabel: 'Official Mission Performance Score:',
    deterministicFormulaLabel: 'Deterministic Formula:',
    outcomeNarrativeTitle: 'MISSION OUTCOME NARRATIVE',
    engineeringRationaleTitle: 'SYSTEMS ENGINEERING RATIONALE',
    educationalTakeawayTitle: 'CORE EDUCATIONAL TAKEAWAY',
    finalReservesTitle: 'Final Resource Reserves (Normalized Points):',
    decisionChronologyTitle: 'MISSION DECISION CHRONOLOGY',
    restartMissionButton: 'RESTART MISSION SIMULATION',
    pointsUnit: 'PTS',
    statusCheckingSystems: 'FLIGHT SYSTEMS CHECK',
    statusPropulsionNominal: 'PROPULSION NOMINAL',
    statusGuidanceOnline: 'GUIDANCE COMPUTER ONLINE',
    statusCountdownInitiated: 'INITIATING COUNTDOWN',
    statusIgnition: 'IGNITION',
    statusLiftoff: 'LIFTOFF!',
    statusScrubbed: 'HOLD COUNTDOWN - SCRUBBED',
    statusAtmosphericEntry: 'ATMOSPHERIC ENTRY IN PROGRESS',
    statusContactLost: 'TELEMETRY SIGNAL LOST',
  },
  ar: {
    enterStation: 'دخول المحطة الفضائية',
    startNewMission: 'بدء مهمة جديدة',
    resumeMission: 'استئناف المهمة',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    handbook: 'دليل الفضاء',
    about: 'عن اللعبة',
    back: 'رجوع',
    saveAndClose: 'حفظ وإغلاق',
    resetDefaults: 'استعادة الإعدادات الافتراضية',
    gameTitle: 'نوفا سكريبت',
    gameSubtitle: 'محاكي هندسة وتصميم المهمات الفضائية السحيقة',
    soundOn: 'الصوت مفعّل',
    soundOff: 'الصوت مكتوم',
    chooseAstronaut: 'اختيار رائد الفضاء النشط',
    alexDesignation: 'أليكس // قائد المهمة',
    mayaDesignation: 'مايا // أخصائية الفضاء',
    version: 'محاكي المحطة الفضائية v2.2 // العمليات المدارية',

    stationRadar: 'رادار المحطة الفضائية',
    radarSubtitle: 'مسح مداري نشط',
    centralHub: 'ردهة العبور المركزية',
    centralHubDesc: 'الرابط المحوري الذي يربط بين أقسام المحطة المدارية الستة',
    commandCenter: 'مركز القيادة والتحكم',
    commandCenterDesc: 'شاشات القياس عن بُعد، الرصد المداري، ومنصة المراقبة',
    vehicleHangar: 'حظيرة المركبات الفضائية',
    vehicleHangarDesc: 'عنبر تركيب وتجميع المركبات وطاولة الصيانة والهندسة',
    scienceLab: 'المختبر العلمي',
    scienceLabDesc: 'أبحاث الجيولوجيا الفلكية ومطياف الليزر لتحليل العينات',
    commsArray: 'مصفوفة الاتصالات',
    commsArrayDesc: 'محطة هوائي شبكة الفضاء السحيق ومعايرة الترددات',
    resourceBay: 'مستودع الموارد والخامات',
    resourceBayDesc: 'تخزين المواد الأولية، خلايا الاندماج، والخامات المسترجعة',
    missionBoard: 'لوحة إطلاق المهمات',
    missionBoardDesc: 'حاسوب مسارات الطيران ومنصة إطلاق الرحلات الاستكشافية',
    dirCenter: 'المركز',
    dirWest: 'الغرب [W]',
    dirEast: 'الشرق [E]',
    dirNorthWest: 'الشمال الغربي [NW]',
    dirNorthEast: 'الشمال الشرقي [NE]',
    dirSouthWest: 'الجنوب الغربي [SW]',
    dirSouthEast: 'الجنوب الشرقي [SE]',
    radarClickHint: 'انقر على أي قسم لتفعيل نظام الملاحة التلقائي',
    targetWaypoint: 'الوجهة المحددة',
    distance: 'المسافة',
    meters: 'متر',

    inventory: 'المخزون',
    crafting: 'التصنيع',
    hangar: 'الحظيرة',
    pause: 'إيقاف',
    interactPrompt: '[E] تفاعل',
    doubleClickPrompt: '[E] تفاعل // نقر مزدوج',
    radarToggle: '[M] إخفاء',
    info: 'دليل الفضاء',
    controlsMove: 'WASD أو الأسهم للحركة',
    controlsInteract: '[E] التفاعل',
    controlsInventory: '[I] المخزون',
    controlsProfile: '[P] الملف الشخصي',
    controlsRadar: '[M] الرادار',
    capacity: 'السعة',
    maxCapacity: 'الحد الأقصى',

    metalScrap: 'خردة معادن',
    metalScrapDesc: 'شظايا سبائك التيتانيوم المسترجعة لإصلاح وتطوير الهيكل.',
    energyCell: 'خلية طاقة',
    energyCellDesc: 'خلايا اندماجية دقيقة لتغذية أنظمة المحطة بالطاقة المستمرة.',
    scienceSample: 'عينة علمية',
    scienceSampleDesc: 'عينات من التربة والصخور الكوكبية للتحليل الطيفي بالليزر.',
    blueprintFragment: 'جزء مخطط هندسي',
    blueprintFragmentDesc: 'مخططات هندسية لتصنيع ترقيات المركبة الفضائية.',
    rareMineral: 'معدن نادر',
    rareMineralDesc: 'بلورات سيليكات فضائية نادرة ذات مقاومة حرارية فائقة.',

    workbenchTitle: 'طاولة الهندسة والتصنيع الفضائي',
    workbenchSubtitle: 'استخدم المواد المسترجعة لتصنيع ترقيات تجميلية لمركبتك الفضائية.',
    craftUpgrade: 'تصنيع الترقية',
    craftedBadge: 'تم التثبيت',
    insufficientMaterials: 'المواد غير كافية',
    cosmeticUpgradeNotice: 'ترقيات المظهر تخص الهيكل الخارجي ولا تؤثر على معادلات المهمة العلمية.',
    materialsRequired: 'المواد المطلوبة:',

    missionAssignment: 'تكليف المهمة الفضائية',
    selectTargetTitle: 'اختر الوجهة الفضائية',
    selectTargetSubtitle: 'حدد وجهتك الاستكشافية. لكل مسار حساباته المدارية وتحدياته الهندسية الخاصة.',
    lunarMissionTitle: 'مهمة استكشاف القمر',
    lunarMissionDesc: 'تصميم مسبار آلي لاستكشاف سطح القمر ودراسة جيولوجيته واختبار تقنيات الهبوط.',
    marsMissionTitle: 'رحلة استكشاف المريخ',
    marsMissionDesc: 'تصميم مركبة فضائية عابرة للكواكب للهبوط على المريخ والبحث عن آثار المياه القديمة.',
    shorterTransit: 'رحلة 3 أيام',
    moderateComplexity: 'دلتا-في معتدلة',
    longerTransit: 'رحلة 7-9 أشهر',
    higherComplexity: 'أحمال حرارية عالية',
    selectMoonButton: 'اختيار مهمة القمر',
    selectMarsButton: 'اختيار مهمة المريخ',

    antennaTitle: 'معايرة هوائي شبكة الفضاء السحيق',
    antennaSubtitle: 'قم بموازنة تردد الهوائي عالي الكسب لتحقيق اتصال لاسلكي مستقر مع القيادة الأرضية.',
    antennaFrequency: 'تردد الموجة الحاملة',
    antennaSignalStrength: 'قوة الإشارة',
    antennaLock: 'تثبيت التردد',
    antennaLocked: 'تم تثبيت ومعايرة الإشارة بنجاح',
    spectrometerTitle: 'مطياف الليزر لتحليل العينات',
    spectrometerSubtitle: 'اضبط الطول الموجي لليزر لتحديد البصمة الطيفية للعينات الصخرية والمعدنية.',
    spectrometerWavelength: 'الطول الموجي لليزر',
    spectrometerCalibrate: 'تحليل العينة',
    spectrometerIdentified: 'تم التعرف على البصمة المعدنية',

    profileTitle: 'سجل رائد الفضاء والخدمة',
    commanderPersonnel: 'سجل طاقم رواد المحطة',
    careerStats: 'إحصائيات وسجلات الطيران الفضائي',
    missionsCompleted: 'المهمات المنجزة',
    endingsDiscovered: 'النهايات المكتشفة',
    bestScore: 'أعلى نقاط محققة',
    modulesVisited: 'الأقسام المستكشفة',
    itemsCrafted: 'المعدات المصنعة',
    materialsCollected: 'المواد المسترجعة',
    suitColorTitle: 'طلاء بدلة السير الفضائي (EVA)',
    resetProgress: 'إعادة تعيين بيانات التقدم',
    alexBio: 'القائد أليكس فانس — مهندس طيران أول وقائد رحلات فضائية بأكثر من 4,200 ساعة مدارية مسجلة.',
    mayaBio: 'الأخصائية د. مايا لين — عالمة جيولوجيا كوكبية وباحثة في علم الأحياء الفلكي والتحليل الطيفي.',
    rankCosmosLegend: 'أسطورة الفضاء',
    rankArchitect: 'كبير مهندسي النظم الفضائية',
    rankDirector: 'مدير عمليات الطيران الفضائي',
    rankSpecialist: 'أخصائي مهام فضائية',
    rankCadet: 'مستكشف متدرب',

    audioEngine: 'محرك الصوت',
    graphicsMood: 'المظهر والجرافيكس',
    keybindings: 'أزرار التحكم',
    masterVolume: 'مستوى الصوت العام',
    musicVolume: 'الموسيقى التصويرية التفاعلية',
    sfxVolume: 'المؤثرات الصوتية',

    visualModeTitle: 'نمط العرض ومظهر المحطة',
    modeCinematic: 'محاكاة ثلاثية الأبعاد واقعية',
    modeCinematicDesc: 'إضاءة فلكية واقعية متوازنة، انعكاسات معدنية ناعمة، وعمق نجمي سينمائي.',
    modeRetro: 'بيكسل فوكسل 3D (نمط ماين كرافت)',
    modeRetroDesc: 'عالم مكعبات بيكسل ثلاثي الأبعاد مستوحى من ماين كرافت مع تضاريس فوكسل حادة وظلال بيكسل.',
    modeCyber: 'سايبر بانك نيون متوهج',
    modeCyberDesc: 'توهج نيون كهربائي مشبع باللونين السيان والماجنتا مع خطوط مسح رقمية ولمعان هولوغرافي.',
    modePerf: 'مخطط هندسي تكتيكي (CAD خفيف)',
    modePerfDesc: 'خطوط شبكية هولوغرافية خفيفة عالية الوضوح مع سرعة فائقة توفر أقصى معدل إطارات.',

    keybindingsDesc: 'اضغط على أي زر لإعادة تعيينه. يدعم عدة أزرار لكل حركة.',
    rebindPrompt: 'اضغط أي زر على لوحة المفاتيح...',
    keyAssigned: 'مُعين',

    actionMoveForward: 'التحرك للأمام (شمال)',
    actionMoveBackward: 'التحرك للخلف (جنوب)',
    actionMoveLeft: 'التحرك لليسار (غرب)',
    actionMoveRight: 'التحرك لليمين (شرق)',
    actionInteract: 'التفاعل مع الأجهزة والأشياء',
    actionInventory: 'فتح مخزون المواد',
    actionProfile: 'فتح ملف القائد والبدلة',
    actionMinimap: 'إظهار/إخفاء رادار المحطة',
    actionHandbook: 'فتح موسوعة ودليل الفضاء',
    actionPause: 'إيقاف مؤقت / إغلاق النوافذ',

    optionA: 'الخيار (أ)',
    optionB: 'الخيار (ب)',
    chooseOption: 'تأكيد الاختيار',
    engineeringImpact: 'الأثر الهندسي والمواردي:',
    confirmDecision: 'تأكيد القرار',
    sourceText: 'المرجع الفني لوكالة ناسا',
    scoreLabel: 'نقاط المهمة',
    stageLabel: 'مرحلة الرحلة',

    language: 'اللغة / LANGUAGE',

    bannerSubtitle: 'محاكي هندسة وتصميم المهمات والعمليات الفضائية',
    gameSlogan: '"صمم. قرر. استكشف."',
    educationalDisclaimer: 'نوفا سكريبت هي لعبة محاكاة فلكية تعليمية مستقلة، وليست منتجاً رسمياً لوكالة ناسا ولا تتبع لها.',
    aboutModalTitle: 'ملخص المهمة والاعتمادات العلمية',
    aboutParagraph1: 'في لعبة نوفا سكريبت، أنت قائد المهمة الفضائية المسؤول عن تصميم وبناء وإطلاق وإدارة مركبة آلية استكشافية بين الكواكب.',
    aboutParagraph2: 'استكشف 31 قراراً هندسياً متبادلاً مع موازنة الميزانية، والكتلة، والطاقة، والقيمة العلمية، وهوامش الاتصال اللاسلكي.',
    aboutAttribution: 'المرجع العلمي: مستوحى من تحدي تطبيقات الفضاء لوكالة ناسا 2026 ومنهجية مستويات نضج المفاهيم الهندسية لمختبر الدفع النفاث (JPL).',
    close: 'إغلاق',

    modeBadgeCinematic: 'سينمائي 3D',
    modeBadgeRetro: 'فوكسل 3D',
    modeBadgeCyber: 'سايبر نيون',
    modeBadgePerf: 'مخطط CAD',
    cycleVisualModeHint: 'تبديل نمط العرض الفني (سينمائي / فوكسل ماين كرافت / سايبر نيون / مخطط CAD)',

    reportHeaderBadge: 'لجنة الطيران الفضائي // التقرير الختامي للرحلة',
    officialScoreLabel: 'النقاط الرسمية لأداء المهمة الفضائية:',
    deterministicFormulaLabel: 'المعادلة الحسابية المحددة:',
    outcomeNarrativeTitle: 'سرد النتيجة الختامية للمهمة',
    engineeringRationaleTitle: 'التحليل الهندسي للنظم الفضائية',
    educationalTakeawayTitle: 'المبدأ العلمي والتعليمي المستفاد',
    finalReservesTitle: 'احتياطي الموارد الختامي (نقاط معيارية):',
    decisionChronologyTitle: 'التسلسل الزمني لقرارات المهمة',
    restartMissionButton: 'إعادة تشغيل محاكي المهمة',
    pointsUnit: 'نقطة',
    statusCheckingSystems: 'فحص أنظمة الطيران المداري',
    statusPropulsionNominal: 'أنظمة الدفع الصاروخي في الوضع الاسمي',
    statusGuidanceOnline: 'حاسوب التوجيه والملاحة متصل',
    statusCountdownInitiated: 'بدء العد التنازلي للإطلاق',
    statusIgnition: 'إشعال المحركات الصاروخية',
    statusLiftoff: 'الانطلاق نحو المدار الفضائي!',
    statusScrubbed: 'إيقاف العد التنازلي - إلغاء الإطلاق',
    statusAtmosphericEntry: 'بدء مناورة اختراق الغلاف الجوي',
    statusContactLost: 'انقطاع إشارة القياس عن بُعد',
  },
};
