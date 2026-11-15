/**
 * NovaScript Localization Dictionary (English by default, Arabic optional).
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
  
  // Minimap
  stationRadar: string;
  centralHub: string;
  commandCenter: string;
  vehicleHangar: string;
  scienceLab: string;
  commsArray: string;
  resourceBay: string;
  missionBoard: string;
  
  // HUD
  inventory: string;
  interactPrompt: string;
  doubleClickPrompt: string;
  radarToggle: string;
  info: string;
  
  // Settings Tabs
  audioEngine: string;
  graphicsMood: string;
  keybindings: string;
  
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

  // Language
  language: string;
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

    stationRadar: 'STATION RADAR',
    centralHub: 'Central Hub',
    commandCenter: 'Command Center',
    vehicleHangar: 'Vehicle Hangar',
    scienceLab: 'Science Lab',
    commsArray: 'Comms Array',
    resourceBay: 'Resource Bay',
    missionBoard: 'Mission Board',

    inventory: 'Inventory',
    interactPrompt: '[E] INTERACT',
    doubleClickPrompt: '[E] INTERACT // DOUBLE-CLICK',
    radarToggle: '[M] Radar',
    info: 'INFO',

    audioEngine: 'AUDIO ENGINE',
    graphicsMood: 'GRAPHICS & MOOD',
    keybindings: 'KEYBOARD CONTROLS',

    visualModeTitle: 'STATION RENDERING MOOD',
    modeCinematic: '3D Cinematic (Default)',
    modeCinematicDesc: 'Full dynamic Three.js lighting, volumetric space shadows, and headlight glow',
    modeRetro: '16-Bit Pixel Art Mode',
    modeRetroDesc: 'Retro arcade CRT scanline curvature and nostalgic pixel filter',
    modeCyber: 'Cyberpunk Neon Mode',
    modeCyberDesc: 'High-contrast glowing holographic contours and saturated cyan/magenta hues',
    modePerf: 'High Performance Mode',
    modePerfDesc: 'Optimized flat shading for high-framerate or mobile battery saving',

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

    language: 'LANGUAGE / اللغة',
  },
  ar: {
    enterStation: 'دخول المحطة',
    startNewMission: 'بدء مهمة جديدة',
    resumeMission: 'استئناف المهمة',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    handbook: 'دليل الفضاء',
    about: 'عن اللعبة',
    back: 'رجوع',
    saveAndClose: 'حفظ وإغلاق',
    resetDefaults: 'استعادة الإعدادات الافتراضية',

    stationRadar: 'رادار المحطة',
    centralHub: 'الممر المركزي',
    commandCenter: 'غرفة القيادة والتحكم',
    vehicleHangar: 'حظيرة المركبات',
    scienceLab: 'المختبر العلمي',
    commsArray: 'مصفوفة الاتصالات',
    resourceBay: 'مستودع الموارد',
    missionBoard: 'لوحة إطلاق المهمات',

    inventory: 'المخزون',
    interactPrompt: '[E] تفاعل',
    doubleClickPrompt: '[E] تفاعل // نقر مزدوج',
    radarToggle: '[M] الرادار',
    info: 'دليل',

    audioEngine: 'محرك الصوت',
    graphicsMood: 'المظهر والجرافيكس',
    keybindings: 'أزرار التحكم',

    visualModeTitle: 'نمط العرض ومظهر المحطة',
    modeCinematic: 'سينمائي 3D (الافتراضي)',
    modeCinematicDesc: 'إضاءة ثلاثية الأبعاد ديناميكية مع ظلال فلكية وكشافات رأس متوهجة',
    modeRetro: 'ريترو بكسل 16-بت',
    modeRetroDesc: 'فلتر أركيد كلاسيكي مع خطوط شاشات الـ CRT الكلاسيكية',
    modeCyber: 'سايبر بانك نيون',
    modeCyberDesc: 'خطوط هولوغرافية متوهجة عالية التباين بألوان السيان والوردي النيون',
    modePerf: 'أداء فائق وتوفير طاقة',
    modePerfDesc: 'إضاءة مسطحة خفيفة لأعلى معدل إطارات وتوفير بطارية الموبايل',

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

    language: 'اللغة / LANGUAGE',
  },
};
