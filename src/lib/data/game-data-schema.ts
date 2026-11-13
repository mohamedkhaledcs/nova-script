import { z } from 'zod';

export const ResourcesSchema = z.object({
  budget: z.number(),
  mass: z.number(),
  power: z.number(),
  scientific_value: z.number(),
  communication: z.number(),
});

export const ResourceBoundsSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const MissionStageSchema = z.enum([
  'mission_planning',
  'spacecraft_design',
  'scientific_instruments',
  'orbit_selection',
  'space_communications',
  'resource_management',
  'launch_planning',
  'mission_operations',
]);

export const SourceCitationSchema = z.object({
  title: z.string(),
  url: z.string(),
  section: z.string(),
});

export const AnswerOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  next_question_id: z.string().nullable(),
  ending_id: z.string().nullable(),
  consequence_summary: z.string(),
  effects: ResourcesSchema.partial(),
  learning_point: z.string(),
});

export const QuestionSchema = z.object({
  id: z.string().min(1),
  stage: MissionStageSchema,
  story: z.string(),
  question: z.string().min(1),
  source: SourceCitationSchema,
  answers: z.array(AnswerOptionSchema).min(1),
});

export const EndingStatusSchema = z.enum([
  'outstanding_success',
  'efficient_success',
  'scientific_discovery',
  'partial_success',
  'strategy_revision',
  'resource_failure',
  'launch_failure',
  'engineering_failure',
]);

export const MissionEndingSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: EndingStatusSchema,
  final_score_formula: z.string().min(1),
  description: z.string(),
  scientific_explanation: z.string(),
  learning_point: z.string(),
});

export const GameDatasetSchema = z
  .object({
    game_title: z.string(),
    version: z.string(),
    start_question_id: z.string().min(1),
    initial_resources: ResourcesSchema,
    resource_bounds: ResourceBoundsSchema,
    questions: z.array(QuestionSchema).min(1),
    endings: z.array(MissionEndingSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const questionIds = new Set(data.questions.map((q) => q.id));
    const endingIds = new Set(data.endings.map((e) => e.id));

    // Verify start question exists
    if (!questionIds.has(data.start_question_id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `start_question_id '${data.start_question_id}' does not exist in questions list`,
        path: ['start_question_id'],
      });
    }

    // Verify uniqueness of question IDs
    if (questionIds.size !== data.questions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate question IDs found',
        path: ['questions'],
      });
    }

    // Verify uniqueness of ending IDs
    if (endingIds.size !== data.endings.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate ending IDs found',
        path: ['endings'],
      });
    }

    // Verify all next_question_id and ending_id references
    for (const q of data.questions) {
      for (const a of q.answers) {
        if (a.next_question_id && !questionIds.has(a.next_question_id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Question '${q.id}' answer '${a.id}' references non-existent question '${a.next_question_id}'`,
            path: ['questions', q.id, 'answers', a.id],
          });
        }
        if (a.ending_id && !endingIds.has(a.ending_id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Question '${q.id}' answer '${a.id}' references non-existent ending '${a.ending_id}'`,
            path: ['questions', q.id, 'answers', a.id],
          });
        }
        if (!a.next_question_id && !a.ending_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Question '${q.id}' answer '${a.id}' has neither next_question_id nor ending_id`,
            path: ['questions', q.id, 'answers', a.id],
          });
        }
      }
    }
  });
