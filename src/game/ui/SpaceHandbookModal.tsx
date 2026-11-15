/**
 * Full-Screen Space Handbook & Mission Operations Encyclopedia.
 * Comprehensive interactive deep-space guide:
 * - Tab 1: Missions & Destinations (Moon vs Mars architecture, flight paths, hazards)
 * - Tab 2: Spacecraft Engineering Subsystems (Bus, Power, DSN Comms, Propulsion, Science Payload)
 * - Tab 3: Orbital Mechanics & Spaceflight Physics 101 (Delta-v, Hohmann transfers, Escape velocity)
 * - Tab 4: Station Modules & Facility Operations (Guide to all 7 hub modules)
 * - Tab 5: Materials & Salvage Components (Metal scrap, fusion cells, samples, blueprints, rare minerals)
 * - Tab 6: Field Log & Discovered Codex Entries (Interactive learning points unlocked from questions)
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  BookOpen,
  Search,
  Rocket,
  Compass,
  Cpu,
  Radio,
  Microscope,
  Sparkles,
  Shield,
  Layers,
  Zap,
  Globe,
  Orbit,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useGameStore } from '@/game/store';
import { audio } from '@/lib/audio/audio-manager';
import { COLLECTIBLE_INFO, COLLECTIBLE_LIMITS, type Language } from '@/game/types';
import { ARABIC_QUESTIONS } from '@/lib/i18n/mission-translations-ar';

interface CodexEntry {
  questionId: string;
  questionText: string;
  answerId: string;
  answerText: string;
  learningPoint: string;
  stage: string;
}

const CODEX_STORAGE_KEY = 'novascript_codex_v1';

function loadSavedCodexEntries(): CodexEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CODEX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

type HandbookTab = 'destinations' | 'engineering' | 'physics' | 'station' | 'materials' | 'codex';

export default function SpaceHandbookModal() {
  const { isCodexOpen, toggleCodex, language } = useGameStore();
  const [activeTab, setActiveTab] = useState<HandbookTab>('destinations');
  const [searchQuery, setSearchQuery] = useState('');
  const [discoveredEntries, setDiscoveredEntries] = useState<CodexEntry[]>([]);

  useEffect(() => {
    if (isCodexOpen) {
      setDiscoveredEntries(loadSavedCodexEntries());
    }
  }, [isCodexOpen]);

  if (!isCodexOpen) return null;

  const tabs: { id: HandbookTab; label: string; icon: any; count: number }[] = [
    {
      id: 'destinations',
      label: language === 'ar' ? 'الوجهات الفضائية' : 'DESTINATIONS',
      icon: Globe,
      count: 2,
    },
    {
      id: 'engineering',
      label: language === 'ar' ? 'أنظمة المركبة' : 'SPACECRAFT SYSTEMS',
      icon: Cpu,
      count: 5,
    },
    {
      id: 'physics',
      label: language === 'ar' ? 'الفيزياء المدارية 101' : 'ORBITAL PHYSICS 101',
      icon: Orbit,
      count: 4,
    },
    {
      id: 'station',
      label: language === 'ar' ? 'أقسام المحطة' : 'STATION MODULES',
      icon: Layers,
      count: 7,
    },
    {
      id: 'materials',
      label: language === 'ar' ? 'المواد المسترجعة' : 'SALVAGE MATERIALS',
      icon: Sparkles,
      count: 5,
    },
    {
      id: 'codex',
      label: language === 'ar' ? 'السجلات الميدانية' : 'DISCOVERED FIELD NOTES',
      icon: BookOpen,
      count: discoveredEntries.length,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-2 sm:p-4 select-none animate-in fade-in duration-200"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl w-full h-[92vh] glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden bg-space-950/95">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/60 bg-space-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 shadow-glow-cyan">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-base sm:text-lg text-white tracking-wider flex items-center gap-2">
                {language === 'ar'
                  ? 'دليل وموسوعة نوفا سكريبت للفضاء السحيق'
                  : 'NOVASCRIPT DEEP-SPACE HANDBOOK & ARCHIVE'}
                <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 font-mono">
                  {language === 'ar' ? 'دليل العمليات v2.4' : 'v2.4 TELEMETRY MANUAL'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'ar'
                  ? 'الدليل الشامل للعمليات والأسس العلمية للمهمات الفضائية المدارية'
                  : 'COMPREHENSIVE SPACE MISSION OPERATIONAL GUIDE & SCIENTIFIC PRINCIPLES'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className={`w-3.5 h-3.5 absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث في الموسوعة...' : 'Search archive...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 rounded-lg bg-space-950/90 border border-space-border/60 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400`}
              />
            </div>

            <button
              onClick={() => {
                audio.click();
                toggleCodex();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-850 transition-colors cursor-pointer"
              title="Close Handbook [ESC / Tab]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-1 px-6 py-2 bg-space-950/80 border-b border-space-border/50 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audio.click();
                  setActiveTab(tab.id as HandbookTab);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white shadow-glow-cyan border border-cyan-400/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/40' : 'bg-space-900 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'destinations' && <DestinationsSection query={searchQuery} language={language} />}
          {activeTab === 'engineering' && <EngineeringSection query={searchQuery} language={language} />}
          {activeTab === 'physics' && <PhysicsSection query={searchQuery} language={language} />}
          {activeTab === 'station' && <StationSection query={searchQuery} language={language} />}
          {activeTab === 'materials' && <MaterialsSection query={searchQuery} language={language} />}
          {activeTab === 'codex' && <CodexSection entries={discoveredEntries} query={searchQuery} language={language} />}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-2.5 bg-space-900 border-t border-space-border/50 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{language === 'ar' ? 'اضغط [TAB] أو [ESC] لإغلاق الدليل' : 'PRESS [TAB] OR [ESC] TO EXIT HANDBOOK'}</span>
          <span className="text-cyan-400">{language === 'ar' ? 'بروتوكول نوفا سكريبت الاستكشافي // غير مصنف' : 'NOVASCRIPT EXPEDITION PROTOCOL // UNCLASSIFIED'}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 1. Destinations Section (Moon vs Mars Architecture)
// ============================================================================

function DestinationsSection({ query, language }: { query: string; language?: Language }) {
  const isAr = language === 'ar';
  const destinations = isAr
    ? [
        {
          name: 'القمر // مبادرة استكشاف القمر',
          target: 'القمر (تابع الأرض الطبيعي)',
          distance: '384,400 كم',
          lag: '1.28 ثانية (اتصال فوري تقريباً)',
          gravity: '1.62 م/ث² (16.6% من جاذبية الأرض)',
          color: 'border-cyan-500/40 bg-gradient-to-br from-space-900/90 to-cyan-950/20',
          badgeColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-400/40',
          summary:
            'تابع الأرض الفلكي الأقرب يُعد ميدان الاختبار الحقيقي لبقاء الإنسان في الفضاء السحيق واستغلال الموارد في الموقع وتأسيس محطات علمية دائمة.',
          objectives: [
            'مسح المناطق المظلمة دائماً (PSRs) داخل فوهات القطبين (مثل فوهة شاكلتون) لرصد ترسبات جليد الماء.',
            'تحليل عينات بازلت بحار القمر لتحديد الحقب البركانية القديمة وفترات القصف النيزكي الكثيف.',
            'تأسيس محطات ترحيل لاسلكية تربط شبكة الفضاء السحيق بالمراصد الفلكية على الجانب البعيد للقمر.',
          ],
          hazards: [
            'غبار الحطام الصخري الكهروستاتيكي الحاد الذي يخدش موانع التسرب الميكانيكية والألواح الشمسية.',
            'تقلبات حرارية قصوى تتراوح بين +120° مئوية في ضوء الشمس إلى -180° مئوية في الظل (-246° في الفوهات القطبية).',
            'إشعاعات التوهجات الشمسية المباشرة والقصف النيزكي الدقيق في ظل انعدام الغلاف الجوي.',
          ],
          telemetry: {
            escapeVel: '2.38 كم/ث',
            orbitalPeriod: '27.3 يوماً',
            atmosphere: 'إكسوسفير رقيق للغاية (~10⁻¹⁰ باسكال)',
          },
        },
        {
          name: 'المريخ // ملحمة الكوكب الأحمر',
          target: 'المريخ (الكوكب الأرضي الرابع)',
          distance: '54.6 مليون إلى 401 مليون كم (حسب المدار)',
          lag: '4.3 إلى 21.0 دقيقة (يتطلب ذكاءً اصطناعياً مستقلاً)',
          gravity: '3.72 م/ث² (38% من جاذبية الأرض)',
          color: 'border-amber-500/40 bg-gradient-to-br from-space-900/90 to-amber-950/20',
          badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-400/40',
          summary:
            'الوجهة الرئيسية للاستكشاف بين الكواكب. يحتفظ المريخ بدلتا الأنهار القديمة، ومعادن الطين، والتراكيب الجيولوجية البركانية التي تحمل أسرار قابلية الحياة في الماضي.',
          objectives: [
            'تحليل طبقات الطين الرسوبية داخل بحيرة فوهة جيزيرو القديمة بحثاً عن آثار الحياة الحيوية المحفوظة.',
            'اختبار استخلاص الأكسجين القابل للتنفس من ثاني أكسيد الكربون في الغلاف الجوي للمريخ بتقنية ISRU.',
            'نشر شبكة مقاييس الزلازل لرصد الزلازل المريخية وتحديد حدود النواة والوشاح الكوكبي.',
          ],
          hazards: [
            'دقائق الرعب السبعة (EDL): الدخول بسرعة 20,000 كم/ساعة يتطلب دروعاً حرارية بالغة التطور ومظلات فوق صوتية.',
            'العواصف الترابية الكوكبية التي تحجب ضوء الشمس لأشهر متتالية، مما يتطلب مصادر طاقة نووية (RTG) مساعدة.',
            'إشعاعات الرياح الشمسية العميقة بسبب غياب المجال المغناطيسي الكوكبي النشط.',
          ],
          telemetry: {
            escapeVel: '5.03 كم/ث',
            orbitalPeriod: '687 يوماً أرضياً',
            atmosphere: 'ثاني أكسيد الكربون 95.3%، نيتروجين 2.6%، أرغون 1.9%',
          },
        },
      ]
    : [
        {
          name: 'THE MOON // LUNAR EXPLORATION INITIATIVE',
          target: 'Luna (Earth Satellite)',
          distance: '384,400 km',
          lag: '1.28 Seconds (Near-Realtime Comm)',
          gravity: '1.62 m/s² (16.6% of Earth)',
          color: 'border-cyan-500/40 bg-gradient-to-br from-space-900/90 to-cyan-950/20',
          badgeColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-400/40',
          summary:
            'Earth’s celestial companion serves as the proving ground for human deep-space survival, ISRU (In-Situ Resource Utilization), and permanent scientific bases.',
          objectives: [
            'Survey Permanently Shadowed Regions (PSRs) inside polar crater basins (e.g., Shackleton Crater) for cryogenic water-ice deposits.',
            'Analyze ancient Mare Basalt samples to date primordial lunar volcanic epochs and heavy bombardment.',
            'Establish automated communications relay nodes connecting Earth DSN stations with far-side farside lunar observatories.',
          ],
          hazards: [
            'Abrasive electrostatic regolith dust that cuts into mechanical seals and solar panels.',
            'Extreme thermal swings from +120°C in direct lunar sunlight to -180°C in shadow (-246°C in PSRs).',
            'Direct solar flare radiation and micrometeorite bombardment with zero atmospheric protection.',
          ],
          telemetry: {
            escapeVel: '2.38 km/s',
            orbitalPeriod: '27.3 Days',
            atmosphere: 'Exosphere (~10⁻¹⁰ Pa)',
          },
        },
        {
          name: 'MARS // THE RED PLANET ODYSSEY',
          target: 'Mars (4th Terrestrial Planet)',
          distance: '54.6M to 401M km (Varies with Orbit)',
          lag: '4.3 to 21.0 Minutes (Autonomous AI Required)',
          gravity: '3.72 m/s² (38% of Earth)',
          color: 'border-amber-500/40 bg-gradient-to-br from-space-900/90 to-amber-950/20',
          badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-400/40',
          summary:
            'The primary destination for interplanetary exploration. Mars preserves ancient river deltas, clay minerals, and extinct volcanic geology holding clues to past habitability.',
          objectives: [
            'Analyze sedimentary clay strata inside Jezero Crater paleolake for biosignature preservation.',
            'Test atmospheric ISRU extraction of breathable oxygen (O2) from ambient Martian Carbon Dioxide (CO2).',
            'Deploy seismometer networks to measure Marsquakes and map the planetary core-mantle boundary.',
          ],
          hazards: [
            'The 7 Minutes of Terror (EDL): Entering at 20,000 km/h requires hypersonic ablative heat shields and supersonic parachutes.',
            'Global planetary dust storms that obscure solar arrays for months at a time, requiring nuclear RTG auxiliary power.',
            'Deep solar wind radiation due to the absence of a global planetary magnetic dynamo.',
          ],
          telemetry: {
            escapeVel: '5.03 km/s',
            orbitalPeriod: '687 Earth Days',
            atmosphere: 'CO2 95.3%, N2 2.6%, Ar 1.9% (610 Pa surface)',
          },
        },
      ];

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-xl bg-space-900/80 border border-space-border/60 text-xs text-slate-300 leading-relaxed ${isAr ? 'font-sans' : 'font-mono'}`}>
        <span className="text-cyan-400 font-bold">{isAr ? 'ملخص الوجهات الفضائية: ' : 'MISSION TARGET BRIEFING: '}</span>
        {isAr
          ? 'تستهدف مهمات نوفا سكريبت إما القمر (استخراج الموارد والممر البوابي) أو المريخ (استكشاف البصمات الحيوية). يجب موازنة حمولة المركبة، وشبكة الطاقة، وهوائيات الاتصال وفقاً للوجهة المستهدفة.'
          : 'NovaScript missions target either the Moon (lunar resource extraction & gateway staging) or Mars (interplanetary biosignature exploration). Your spacecraft payload, power grid, and communications dish must be balanced according to the target destination.'}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((dest, i) => (
          <div
            key={i}
            className={`glass-panel p-6 rounded-2xl border ${dest.color} shadow-lg flex flex-col justify-between`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${dest.badgeColor}`}>
                  {isAr ? 'ملف الوجهة الفضائية' : 'DESTINATION PROFILE'}
                </span>
                <span className="text-xs font-mono text-slate-400">{dest.distance}</span>
              </div>

              <h3 className={`font-bold text-lg text-white tracking-wide ${isAr ? 'font-sans' : 'font-mono'}`}>{dest.name}</h3>
              <p className={`text-xs text-slate-300 leading-relaxed ${isAr ? 'font-sans' : 'font-mono'}`}>{dest.summary}</p>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-space-950/80 border border-space-border/50 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'الجاذبية السطحية' : 'SURFACE GRAVITY'}</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">{dest.gravity}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'تأخير الاتصال' : 'COMM LAG'}</div>
                  <div className="text-xs font-bold text-amber-300 mt-0.5">{dest.lag}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'سرعة الإفلات' : 'ESCAPE VELOCITY'}</div>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5">{dest.telemetry.escapeVel}</div>
                </div>
              </div>

              {/* Core Objectives */}
              <div className="space-y-2">
                <div className={`text-xs font-bold text-slate-200 ${isAr ? 'font-sans' : 'font-mono'}`}>
                  {isAr ? 'الأهداف العلمية الأساسية:' : 'CORE SCIENTIFIC OBJECTIVES:'}
                </div>
                <ul className="space-y-1.5">
                  {dest.objectives.map((obj, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-xs text-slate-300 ${isAr ? 'font-sans' : 'font-mono'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hazards */}
              <div className="space-y-2 pt-2 border-t border-space-border/40">
                <div className={`text-xs font-bold text-rose-300 ${isAr ? 'font-sans' : 'font-mono'}`}>
                  {isAr ? 'المخاطر والتحديات البيئية المدارية:' : 'ENVIRONMENTAL FLIGHT RISKS:'}
                </div>
                <ul className="space-y-1.5">
                  {dest.hazards.map((haz, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-xs text-slate-400 ${isAr ? 'font-sans' : 'font-mono'}`}>
                      <span className="text-rose-400 font-bold shrink-0 text-[10px]">[!]</span>
                      <span>{haz}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 2. Spacecraft Engineering Systems
// ============================================================================

function EngineeringSection({ query, language }: { query: string; language?: Language }) {
  const isAr = language === 'ar';
  const subsystems = isAr
    ? [
        {
          title: '1. الهيكل الأساسي والعزل الحراري للمركبة',
          icon: Layers,
          color: 'border-cyan-500/40 text-cyan-300',
          description:
            'الهيكل الفيزيائي الذي يدعم خزانات الوقود، والأجهزة العلمية، وحلقات الالتحام المداري، ويحدد الكتلة الجافة للمركبة.',
          architectures: [
            {
              name: 'شبكة سبائك التيتانيوم الهيكلية',
              pros: 'صلابة ميكانيكية استثنائية، مقاومة حرارية عالية، وتكلفة تصنيع معتدلة.',
              cons: 'كتلة أثقل؛ تقلل هامش دلتا-في المتاح لكمية وقود معينة.',
            },
            {
              name: 'مركبات ألياف الكربون والبوليمر المعزز (CFRP)',
              pros: 'خفة وزن مذهلة للكتلة الهيكلية؛ تتيح أقصى هامش ممكن للأجهزة والوقود.',
              cons: 'حساسة للتشقق والاهتزازات الصوتية العنيفة المصاحبة للحظات الإطلاق.',
            },
          ],
        },
        {
          title: '2. نظام الطاقة الكهربائية (EPS)',
          icon: Zap,
          color: 'border-amber-500/40 text-amber-300',
          description:
            'توليد وتنظيم وتوزيع الطاقة الكهربائية لحواسيب الطيران، وهوائيات الإرسال، وعجلات التوجيه، والمستشعرات.',
          architectures: [
            {
              name: 'مصفوفات الألواح الشمسية (زرنيخيد الغاليوم GaAs)',
              pros: 'عمر تشغيلي غير محدود ضمن مسافة 1.5 وحدة فلكية من الشمس، دون أي مخاطر إشعاعية.',
              cons: 'تهبط الطاقة وفق قانون التربيع العكسي، وتتعطل تماماً أثناء العواصف الترابية الكوكبية.',
            },
            {
              name: 'المولد النووي الحراري بالنظائر المشعة (RTG)',
              pros: 'اضمحلال البلوتونيوم-238 يوفر طاقة مستمرة ومستقرة في أي مكان في الفضاء السحيق والظلام.',
              cons: 'كتلة ثقيلة، تكلفة مالية باهظة، وحاجة مستمرة لتصريف الحرارة الزائدة.',
            },
          ],
        },
        {
          title: '3. اتصالات الفضاء السحيق (DSN)',
          icon: Radio,
          color: 'border-emerald-500/40 text-emerald-300',
          description:
            'منظومة الإرسال والاستقبال اللاسلكي للتواصل مع صحون شبكة الفضاء السحيق لناسا في غولدستون ومدريد وكانبيرا.',
          architectures: [
            {
              name: 'صحن هوائي مكافئ عالي الكسب',
              pros: 'سرعة نقل بيانات فائقة (>500 كيلوبت/ثانية) تسمح ببث الصور والخرائط الطيفية بدقة.',
              cons: 'يتطلب توجيهاً دقيقاً ثلاثي المحاور نحو الأرض؛ ينقطع الاتصال في حال انحراف المركبة.',
            },
            {
              name: 'هوائيات تصحيحية منخفضة الكسب لجميع الاتجاهات',
              pros: 'تغطية كروية 360 درجة تضمن التقاط إشارة الطوارئ حتى لو كانت المركبة تدور حول نفسها.',
              cons: 'سرعة نقل بيانات بطيئة جداً (<10 بت/ثانية) لا تكفي لإرسال البيانات العلمية الضخمة.',
            },
          ],
        },
        {
          title: '4. الدفع والتحكم في المسار المداري',
          icon: Rocket,
          color: 'border-rose-500/40 text-rose-300',
          description:
            'توفير سرعة الاندفاع دلتا-في للحقن نحو القمر أو المريخ، وتصحيح المسارات أثناء الرحلة والدخول المداري.',
          architectures: [
            {
              name: 'دفع كيميائي ثنائي الوقود (هيدرازين / رباعي أكسيد النيتروجين)',
              pros: 'قوة دفع فورية هائلة (>450 نيوتن) بالغة الأهمية لمناورات الكبح المداري السريعة.',
              cons: 'اندفاع نوعي محدود (Isp ~ 310 ثانية) ووزن وقود رطب ثقيل للغاية.',
            },
            {
              name: 'محركات أيونات الزينون الكهروستاتيكية (تأثير هول)',
              pros: 'كفاءة وقود خارقة (Isp > 3000 ثانية) تخفض وزن الصاروخ عند الإطلاق بدرجة ثورية.',
              cons: 'قوة دفع منخفضة جداً (مللي نيوتن) تتطلب مناورات حلزونية مستمرة لأسابيع.',
            },
          ],
        },
        {
          title: '5. حزمة الأجهزة والحمولة العلمية',
          icon: Microscope,
          color: 'border-purple-500/40 text-purple-300',
          description:
            'قلب المهمة الاستكشافية. جمع القياسات الطيفية والكيميائية والمغناطيسية للإجابة على التساؤلات العلمية.',
          architectures: [
            {
              name: 'مطياف رامان الليزري وكاميرا التصوير متعدد الأطياف',
              pros: 'تحديد دقيق للمعادن والروابط العضوية دون تدمير العينة، مع رصد علامات وجود المياه.',
              cons: 'يتطلب مسافة بؤرية قريبة من الهدف وسحب طاقة كهربائية عالية من بطاريات المركبة.',
            },
            {
              name: 'ذراع مقياس المغناطيسية ومستشعر الجسيمات الكونية',
              pros: 'رسم خرائط المجالات المغناطيسية للقشرة وتدفقات الإشعاع المؤين بين الكواكب.',
              cons: 'يتطلب ذراعاً ممتدة لعزل المستشعر عن التشويش الكهرومغناطيسي لحواسيب المركبة.',
            },
          ],
        },
      ]
    : [
        {
          title: '1. STRUCTURAL BUS & PRIMARY CHASSIS',
          icon: Layers,
          color: 'border-cyan-500/40 text-cyan-300',
          description:
            'The physical skeleton supporting propellant tanks, payload instruments, and orbital docking interfaces. Dictates spacecraft dry mass.',
          architectures: [
            {
              name: 'Titanium-Alloy Truss Matrix',
              pros: 'Exceptional structural rigidity, robust thermal resistance, low fabrication cost.',
              cons: 'Higher total mass penalty; reduces available delta-v for given propellant load.',
            },
            {
              name: 'Carbon-Fiber Reinforced Polymer (CFRP)',
              pros: 'Ultra-lightweight structural mass fraction; maximum payload and propellant margin.',
              cons: 'Susceptible to composite delamination under severe launch acoustic vibration.',
            },
          ],
        },
        {
          title: '2. ELECTRICAL POWER SYSTEM (EPS)',
          icon: Zap,
          color: 'border-amber-500/40 text-amber-300',
          description:
            'Generates and conditions electrical power for flight computers, transceivers, reaction wheels, and science sensors.',
          architectures: [
            {
              name: 'Gallium-Arsenide (GaAs) Solar Arrays',
              pros: 'Unlimited operational lifetime while within 1.5 AU of the Sun; zero radiation hazard.',
              cons: 'Power drops by the inverse-square law ($1/r^2$); ineffective in Martian dust storms.',
            },
            {
              name: 'Radioisotope Thermoelectric Generator (RTG)',
              pros: 'Decay of Plutonium-238 provides continuous 150-300W electrical power anywhere in deep space.',
              cons: 'High mass, thermal heat shedding requirements, and substantial launch budget cost.',
            },
          ],
        },
        {
          title: '3. DEEP SPACE TELECOMMUNICATIONS (DSN)',
          icon: Radio,
          color: 'border-emerald-500/40 text-emerald-300',
          description:
            'RF transceiver architecture communicating with NASA’s Deep Space Network dishes in Goldstone, Madrid, and Canberra.',
          architectures: [
            {
              name: 'High-Gain Cassegrain Reflector Dish',
              pros: 'High-bandwidth telemetry transmission (>500 kbps) for raw multispectral imagery.',
              cons: 'Requires precise 3-axis attitude pointing; communication lost if orientation drifts.',
            },
            {
              name: 'Low-Gain Omnidirectional Patch Antennas',
              pros: 'Spherical 360° coverage; guarantees emergency carrier lock regardless of vehicle tumble.',
              cons: 'Extremely limited bandwidth (<10 bps); unsuitable for high-resolution science payloads.',
            },
          ],
        },
        {
          title: '4. PROPULSION & TRAJECTORY CONTROL',
          icon: Rocket,
          color: 'border-rose-500/40 text-rose-300',
          description:
            'Provides delta-v ($\Delta v$) for translunar/trans-Mars injection, trajectory correction maneuvers (TCMs), and orbit insertion.',
          architectures: [
            {
              name: 'Chemical Bipropellant (MMH / NTO)',
              pros: 'High impulsive thrust (>450 N); critical for rapid planetary orbit insertion burns.',
              cons: 'Specific impulse limited ($I_{sp} \\approx 310\\text{ s}$); heavy propellant wet mass.',
            },
            {
              name: 'Hall-Effect Xenon Ion Propulsion',
              pros: 'Unmatched fuel efficiency ($I_{sp} > 3000\\text{ s}$); drastically reduces launch wet mass.',
              cons: 'Extremely low thrust (millinewtons); burns require continuous spiral maneuvers over weeks.',
            },
          ],
        },
        {
          title: '5. SCIENTIFIC PAYLOAD SUITE',
          icon: Microscope,
          color: 'border-purple-500/40 text-purple-300',
          description:
            'The scientific heart of the vehicle. Collects multispectral, chemical, and magnetic measurements to answer mission science goals.',
          architectures: [
            {
              name: 'Raman Laser Spectrometer & Multispectral Imager',
              pros: 'Non-destructive mineral identification; directly detects hydration bands and carbon bonds.',
              cons: 'Requires close target focal distance and high peak power draw from the electrical bus.',
            },
            {
              name: 'Fluxgate Magnetometer Boom & Particle Detector',
              pros: 'Maps crustal magnetic fields and cosmic ionizing radiation fields in interplanetary space.',
              cons: 'Requires deployable boom separation to prevent spacecraft bus electrical interference.',
            },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subsystems.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div key={idx} className={`glass-panel p-5 rounded-2xl border ${sub.color.split(' ')[0]} space-y-4`}>
              <div className="flex items-center gap-2.5">
                <Icon className={`w-5 h-5 ${sub.color.split(' ')[1]}`} />
                <h4 className={`font-bold text-sm text-white tracking-wide ${isAr ? 'font-sans' : 'font-mono'}`}>{sub.title}</h4>
              </div>
              <p className={`text-xs text-slate-300 leading-relaxed ${isAr ? 'font-sans' : 'font-mono'}`}>{sub.description}</p>

              <div className="space-y-3 pt-2">
                {sub.architectures.map((arch, aIdx) => (
                  <div key={aIdx} className={`p-3 rounded-xl bg-space-950/80 border border-space-border/50 space-y-1 text-xs ${isAr ? 'font-sans' : 'font-mono'}`}>
                    <div className="font-bold text-cyan-300">{arch.name}</div>
                    <div className="text-emerald-400 text-[11px]"><span className="text-slate-400">{isAr ? 'الميزة: ' : 'Advantage: '}</span>{arch.pros}</div>
                    <div className="text-rose-400 text-[11px]"><span className="text-slate-400">{isAr ? 'التحدي الهندسي: ' : 'Trade-off: '}</span>{arch.cons}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 3. Orbital Mechanics & Physics 101
// ============================================================================

function PhysicsSection({ query, language }: { query: string; language?: Language }) {
  const isAr = language === 'ar';
  const concepts = isAr
    ? [
        {
          title: 'معادلة تسيولكوفسكي الصاروخية',
          formula: '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right)',
          meaning:
            'القانون الأساسي لعلم الصواريخ. سرعة الاندفاع (دلتا-في) تعتمد لوغاريتمياً على نسبة كتلة المركبة الرطبة إلى الجافة ($m_0/m_f$) مضروبة في الاندفاع النوعي للمحرك ($I_{sp}$). كل كيلوغرام توفره في الكتلة الجافة يوسع نطاق وصول مهمتك مباشرة.',
        },
        {
          title: 'مدار هوهمان الانتقالي',
          formula: 'a = \\frac{r_1 + r_2}{2}, \\quad v_1 = \\sqrt{\\frac{\\mu}{r_1}} \\left( \\sqrt{\\frac{2r_2}{r_1 + r_2}} - 1 \\right)',
          meaning:
            'أكثر المسارات المدارية كفاءة في استهلاك الوقود بين مدارين كوكبيين دائريين. يستخدم مداراً بيضاوياً مماساً للمدارين، مع حرقين دافعين: الأول لرفع نقطة الأوج والآخر للتدوير المداري النهائي.',
        },
        {
          title: 'سرعة الإفلات وآبار الجاذبية',
          formula: 'v_{esc} = \\sqrt{\\frac{2 G M}{r}}',
          meaning:
            'أدنى سرعة مطلوبة لجسم غير مدفوع للإفلات التام من الجاذبية الكوكبية دون مزيد من الدفع. للأرض: 11.2 كم/ث، للقمر: 2.38 كم/ث، وللمريخ: 5.03 كم/ث.',
        },
        {
          title: 'التوازن الحراري الإشعاعي في الفراغ',
          formula: 'Q_{in} = \\alpha S A_{\\perp} = Q_{out} = \\epsilon \\sigma A_{total} T^4',
          meaning:
            'نظراً لأن الفضاء فراغ شبه تام، لا يوجد انتقال حراري بالتوصيل أو الحمل. تتحدد حرارة المركبة حصرياً بموازنة امتصاص الإشعاع الشمسي ($\\alpha$) مقابل الانبعاث بالأشعة تحت الحمراء ($\\epsilon$). بطانيات العزل الذهبية (MLI) تمنع تجمد الإلكترونيات في الظلام.',
        },
      ]
    : [
        {
          title: 'THE TSIOLKOVSKY ROCKET EQUATION',
          formula: '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right)',
          meaning:
            'The fundamental law of rocketry. Delta-v (change in velocity) depends logarithmically on the vehicle mass ratio ($m_0/m_f$) multiplied by engine specific impulse ($I_{sp}$). Every kilogram of dry mass saved directly expands your mission reach.',
        },
        {
          title: 'HOHMANN TRANSFER ORBIT',
          formula: 'a = \\frac{r_1 + r_2}{2}, \\quad v_1 = \\sqrt{\\frac{\\mu}{r_1}} \\left( \\sqrt{\\frac{2r_2}{r_1 + r_2}} - 1 \\right)',
          meaning:
            'The most fuel-efficient trajectory between two coplanar planetary circular orbits. It uses an elliptical transfer tangent to both orbits, executed with two instantaneous velocity burns: one to raise the apoapsis and one to circularize.',
        },
        {
          title: 'ESCAPE VELOCITY & GRAVITY WELLS',
          formula: 'v_{esc} = \\sqrt{\\frac{2 G M}{r}}',
          meaning:
            'The minimum speed required for a non-propelled body to escape gravitational attraction without further propulsion. For Earth, $v_{esc} \\approx 11.2\\text{ km/s}$; for the Moon, $v_{esc} \\approx 2.38\\text{ km/s}$; for Mars, $v_{esc} \\approx 5.03\\text{ km/s}$.',
        },
        {
          title: 'RADIATIVE THERMAL EQUILIBRIUM IN VACUUM',
          formula: 'Q_{in} = \\alpha S A_{\\perp} = Q_{out} = \\epsilon \\sigma A_{total} T^4',
          meaning:
            'Because space is a near-total vacuum, there is no heat transfer through conduction or convection. Spacecraft temperature is determined entirely by solar absorption ($\\alpha$) versus thermal infrared re-radiation ($\\epsilon$). Multi-Layer Insulation (MLI gold foil) prevents freezing in planetary shadow.',
        },
      ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((item, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3">
            <h4 className={`font-bold text-sm text-cyan-300 tracking-wide ${isAr ? 'font-sans' : 'font-mono'}`}>{item.title}</h4>
            <div className="p-3 rounded-xl bg-space-950 border border-cyan-400/30 text-center font-mono text-sm text-amber-300 font-bold tracking-widest shadow-inner">
              {item.formula}
            </div>
            <p className={`text-xs text-slate-300 leading-relaxed ${isAr ? 'font-sans' : 'font-mono'}`}>{item.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 4. Station Modules Section
// ============================================================================

function StationSection({ query, language }: { query: string; language?: string }) {
  const isAr = language === 'ar';
  const modules = [
    {
      code: 'HUB-TRN',
      name: isAr ? 'ردهة العبور المركزية' : 'Central Transit Hub',
      dir: isAr ? 'المركز' : 'Center',
      desc: isAr
        ? 'الممر الشرياني المركزي الذي يربط بين جميع الأقسام المدارية الستة. بوابات مباشرة لكافة المرافق المتخصصة.'
        : 'The central arterial corridor connecting all orbital modules. Direct transit portals to all 6 specialized facilities.',
    },
    {
      code: 'CMD-00',
      name: isAr ? 'مركز القيادة والتحكم' : 'Command Center',
      dir: isAr ? 'الغرب (←)' : 'West (←)',
      desc: isAr
        ? 'غرفة الإشراف على المهمات، منصة المراقبة البانورامية وشاشات القياس والتشخيص عن بُعد.'
        : 'Mission oversight room. Panoramic observation deck and station diagnostic telemetry consoles.',
    },
    {
      code: 'HNG-02',
      name: isAr ? 'حظيرة المركبات الفضائية' : 'Assembly Hangar',
      dir: isAr ? 'الشرق (→)' : 'East (→)',
      desc: isAr
        ? 'عنبر تركيب وتجميع المركبات الفضائية، نافذة فحص المركبة ثلاثية الأبعاد وطاولة الصيانة والهندسة.'
        : 'Modular vehicle hangar featuring the 3D Spacecraft inspection viewport and the engineering crafting workbench.',
    },
    {
      code: 'LAB-01',
      name: isAr ? 'المختبر العلمي' : 'Science Laboratory',
      dir: isAr ? 'الشمال الغربي [NW]' : 'North-West [NW]',
      desc: isAr
        ? 'مركز أبحاث الجيولوجيا الكوكبية. يضم مطياف الليزر لتحليل العينات الصخرية والمعدنية.'
        : 'Planetary geology research center. Houses the Raman laser spectrometer for mineral sample identification.',
    },
    {
      code: 'COM-03',
      name: isAr ? 'مصفوفة الاتصالات' : 'Communications Array',
      dir: isAr ? 'الشمال الشرقي [NE]' : 'North-East [NE]',
      desc: isAr
        ? 'محطة هوائي شبكة الفضاء السحيق. تتميز بجهاز راسم الإشارات لمعايرة ترددات الاتصال بالأرض.'
        : 'Deep Space Network antenna station. Features the interactive frequency calibration oscilloscope.',
    },
    {
      code: 'RES-05',
      name: isAr ? 'عنبر الموارد والخامات' : 'Resource Bay',
      dir: isAr ? 'الجنوب الغربي [SW]' : 'South-West [SW]',
      desc: isAr
        ? 'مستودع تخزين المواد المسترجعة، سبائك التيتانيوم، خلايا الطاقة الاندماجية، وخزائن الإمدادات.'
        : 'Salvaged materials stockpile containing alloy crates, fusion cells, and supply lockers.',
    },
    {
      code: 'MSN-06',
      name: isAr ? 'لوحة إطلاق المهمات' : 'Mission Launch Board',
      dir: isAr ? 'الجنوب الشرقي [SE]' : 'South-East [SE]',
      desc: isAr
        ? 'منصة عمليات الإطلاق الفضائي. اختر وجهتك الفضائية (القمر أو المريخ) وابدأ تسلسل التخطيط للمهمة.'
        : 'Launch operations terminal. Select your destination (Moon vs Mars) and begin the mission planning sequence.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <div key={m.code} className="glass-panel p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-cyan-300">{m.code}</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-space-950 text-amber-300 border border-amber-500/30">{m.dir}</span>
            </div>
            <div className="font-mono font-bold text-xs text-white">{m.name}</div>
            <p className="font-mono text-xs text-slate-400 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. Materials Section
// ============================================================================

function MaterialsSection({ query, language }: { query: string; language?: string }) {
  const isAr = language === 'ar';
  const list = Object.entries(COLLECTIBLE_INFO) as [keyof typeof COLLECTIBLE_INFO, typeof COLLECTIBLE_INFO[keyof typeof COLLECTIBLE_INFO]][];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(([type, info]) => {
          const limit = COLLECTIBLE_LIMITS[type] ?? 20;
          const localizedName = isAr
            ? type === 'metal-scrap'
              ? 'خردة معادن'
              : type === 'energy-cell'
              ? 'خلية طاقة اندماجية'
              : type === 'science-sample'
              ? 'عينة جيولوجية علمية'
              : type === 'blueprint-fragment'
              ? 'جزء مخطط هندسي'
              : 'معدن كريستالي نادر'
            : info.label;

          const localizedDesc = isAr
            ? type === 'metal-scrap'
              ? 'شظايا سبائك التيتانيوم المسترجعة لإصلاح وتدعيم هياكل المركبات الفضائية.'
              : type === 'energy-cell'
              ? 'خلايا اندماج دقيقة لتغذية أنظمة الدفع والتحكم بالطاقة المستمرة في الفضاء السحيق.'
              : type === 'science-sample'
              ? 'عينات تربة وصخور كوكبية مأخوذة من المحاكاة المدارية للتحليل بالليزر.'
              : type === 'blueprint-fragment'
              ? 'مخططات وبيانات هندسية مدارية لتصميم وتركيب ترقيات المركبة الفضائية.'
              : 'بلورات سيليكات فضائية نقية ذات قدرة استثنائية على تحمل الإشعاعات والحرارة العالية.'
            : info.description;

          return (
            <div key={type} className="glass-panel p-5 rounded-2xl border border-space-border/60 space-y-3">
              <div className="flex items-center justify-between">
                {/* Clean Vector Item Badge (Zero Emojis) */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs"
                  style={{
                    backgroundColor: `${info.color}15`,
                    borderColor: `${info.color}50`,
                    borderWidth: '1px',
                    color: info.color,
                  }}
                >
                  {type === 'metal-scrap' ? 'SCRP' : type === 'energy-cell' ? 'FUSN' : type === 'science-sample' ? 'SMPL' : type === 'blueprint-fragment' ? 'SCHM' : 'CRYS'}
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-space-950 text-cyan-300 border border-cyan-500/30">
                  {isAr ? `أقصى سعة: ${limit}` : `CAPACITY LIMIT: ${limit}`}
                </span>
              </div>
              <div className="font-mono font-bold text-sm text-white">{localizedName}</div>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">{localizedDesc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 6. Codex & Discovered Field Notes Section
// ============================================================================

function CodexSection({ entries, query, language }: { entries: CodexEntry[]; query: string; language?: string }) {
  const isAr = language === 'ar';
  if (entries.length === 0) {
    return (
      <div className="p-12 text-center font-mono space-y-3">
        <BookOpen className="w-10 h-10 text-cyan-400/50 mx-auto" />
        <h4 className="text-sm font-bold text-white tracking-wider">
          {isAr ? 'لم يتم تسجيل ملاحظات ميدانية بعد' : 'NO FIELD NOTES DISCOVERED YET'}
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {isAr
            ? 'ابدأ مهمتك من لوحة المهمات. كل قرار هندسي تتخذه يسجل نقاط تعلم علمية وقياسات مدارية في هذا الأرشيف.'
            : 'Begin missions at the Mission Board. Every engineering decision you commit records scientific learning points and mission telemetry into this archive.'}
        </p>
      </div>
    );
  }

  const filtered = entries.filter(
    (e) =>
      e.questionText.toLowerCase().includes(query.toLowerCase()) ||
      e.learningPoint.toLowerCase().includes(query.toLowerCase()) ||
      e.answerText.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-slate-400">
        {isAr ? 'السجلات الميدانية المسجلة:' : 'RECORDED ENTRIES:'}{' '}
        <span className="text-cyan-400 font-bold">{filtered.length}</span>
      </div>

      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const qAr = isAr ? ARABIC_QUESTIONS[item.questionId] : null;
          const qText = qAr?.question || item.questionText;
          const aText = qAr?.answers[item.answerId]?.text || item.answerText;
          const lPoint = qAr?.answers[item.answerId]?.learning_point || item.learningPoint;

          return (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">
                  {item.questionId} // {isAr ? 'المرحلة' : 'STAGE'}: {item.stage}
                </span>
                <span className="text-emerald-400 font-bold">
                  {isAr ? 'تم اعتماد الخيار' : 'ANSWER COMMITTED'}: {item.answerId}
                </span>
              </div>
              <div className={`font-bold text-xs text-white ${isAr ? 'font-sans' : 'font-mono'}`}>
                {qText}
              </div>
              <div className={`text-xs text-slate-300 ${isAr ? 'font-sans' : 'font-mono'}`}>
                <span className="text-slate-400 font-bold">{isAr ? 'القرار المعتمد: ' : 'Selected Decision: '}</span>
                {aText}
              </div>
              <div className={`p-3 rounded-lg bg-space-950/80 border border-space-border/50 text-xs text-amber-300 ${isAr ? 'font-sans' : 'font-mono'}`}>
                <span className="text-slate-400 font-bold">{isAr ? 'المبدأ العلمي المستفاد: ' : 'SCIENTIFIC LESSON: '}</span>
                {lPoint}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
