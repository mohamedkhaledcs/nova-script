# NovaScript: Data Dictionary & Type Schema

This document specifies the exact data types, schema structures, and mathematical constraints governing NovaScript.

---

## 1. Core Data Models

### 1.1 Resources & Bounds

```typescript
export interface Resources {
  budget: number;           // Remaining financial budget ($M) [0 - 100]
  mass: number;             // Spacecraft dry + payload mass (kg/index) [0 - 100]
  power: number;            // Electrical power reserve / margin (W / %) [0 - 100]
  scientific_value: number; // Cumulative science value return [0 - 100]
  communication: number;    // RF signal link quality / throughput [0 - 100]
}

export interface ResourceBounds {
  min: number; // 0
  max: number; // 100
}

export type ResourceKey = keyof Resources;
```

**Initial State in `ques-en.json`**:
```json
{
  "budget": 70,
  "mass": 20,
  "power": 60,
  "scientific_value": 10,
  "communication": 50
}
```

---

### 1.2 Question & Answer Entities

```typescript
export type MissionStage =
  | 'mission_planning'
  | 'spacecraft_design'
  | 'scientific_instruments'
  | 'orbit_selection'
  | 'space_communications'
  | 'resource_management'
  | 'launch_planning'
  | 'mission_operations';

export interface SourceCitation {
  title: string;
  url: string;
  section: string;
}

export interface AnswerOption {
  id: string;                      // e.g. "A001"
  text: string;                    // User-facing choice text
  next_question_id: string | null; // e.g. "Q002" or null if leads to ending
  ending_id: string | null;        // e.g. "E001" or null if leads to next question
  consequence_summary: string;     // Narrative consequence
  effects: Partial<Resources>;     // Resource changes (additive deltas)
  learning_point: string;          // Educational NASA takeaway
}

export interface Question {
  id: string;               // e.g. "Q001"
  stage: MissionStage;      // Mission phase category
  story: string;            // Situational narrative context
  question: string;         // Prompt text
  source: SourceCitation;   // NASA source attribution
  answers: [AnswerOption, AnswerOption]; // Exactly 2 binary options per question
}
```

---

### 1.3 Mission Endings

```typescript
export type EndingStatus =
  | 'outstanding_success'
  | 'efficient_success'
  | 'scientific_discovery'
  | 'partial_success'
  | 'strategy_revision'
  | 'resource_failure'
  | 'launch_failure'
  | 'engineering_failure';

export interface MissionEnding {
  id: string;                  // e.g. "E001"
  title: string;               // e.g. "Outstanding Scientific Success"
  status: EndingStatus;        // Category status code
  final_score_formula: string; // Deterministic linear formula string
  description: string;         // Ending outcome narrative
  scientific_explanation: string; // Systems engineering rationale
  learning_point: string;      // Educational mission design lesson
}
```

---

## 2. Ending Score Formulas & Safe Evaluator

The 8 ending formulas in `ques-en.json` are:

| Ending ID | Title | Status | Formula String |
|---|---|---|---|
| **E001** | Outstanding Scientific Success | `outstanding_success` | `scientific_value * 1.5 + communication + power + budget` |
| **E002** | Successful Mission with Smart Resource Efficiency | `efficient_success` | `budget * 1.3 + power * 1.2 + scientific_value + communication` |
| **E003** | Valuable Scientific Discovery | `scientific_discovery` | `scientific_value * 1.4 + communication + power` |
| **E004** | Partial Mission Success | `partial_success` | `scientific_value + communication + budget` |
| **E005** | Mission Requires a New Strategy | `strategy_revision` | `scientific_value + power + budget * 0.8` |
| **E006** | Mission Failure Due to Power or Fuel Depletion | `resource_failure` | `scientific_value * 0.5 + budget * 0.5` |
| **E007** | Launch Scrubbed: Payload Mass Overload | `launch_failure` | `budget * 0.6 + scientific_value * 0.4` |
| **E008** | Thermal Protection Failure During Entry | `engineering_failure` | `budget * 0.5` |

### Safe Evaluator Rule
No `eval()` or `Function()` constructor. The scoring engine decomposes formulas into tokens matching the regex:
`([a-z_]+|\d+(?:\.\d+)?|[\+\*])`
Variables are resolved strictly from the player's final `Resources` state, multiplied and summed deterministically.

---

## 3. Mission Runtime State

```typescript
export interface DecisionRecord {
  questionId: string;
  answerId: string;
  timestamp: number;
  resourcesBefore: Resources;
  resourcesAfter: Resources;
  consequenceSummary: string;
  learningPoint: string;
}

export interface MissionState {
  version: string;
  missionId: string;
  startTime: number;
  currentQuestionId: string | null;
  history: DecisionRecord[];
  resources: Resources;
  destination: 'moon' | 'mars' | null;
  selectedComponents: string[];
  completedTaskIds: string[];
  endingId: string | null;
  finalScore: number | null;
  isComplete: boolean;
}
```

---

## 4. Supabase Database Schema

```sql
-- Profiles table for optional authenticated users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Active mission saves
CREATE TABLE public.mission_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_state JSONB NOT NULL,
  current_question_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Completed mission runs (for archives & leaderboards)
CREATE TABLE public.mission_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  ending_id TEXT NOT NULL,
  ending_status TEXT NOT NULL,
  final_score NUMERIC(6, 2) NOT NULL,
  mission_summary JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users manage own save" ON public.mission_saves FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own runs" ON public.mission_runs FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Public read completed runs" ON public.mission_runs FOR SELECT USING (true);
```
