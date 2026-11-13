import { getQuestionById, getEndingById } from '@/lib/data/game-data-service';
import type { Question, AnswerOption, MissionEnding, DecisionRecord, Resources } from '@/types/game';

export interface StepResolution {
  type: 'next_question' | 'ending';
  question: Question;
  selectedAnswer: AnswerOption;
  nextQuestion?: Question;
  ending?: MissionEnding;
}

export function resolveAnswer(
  questionId: string,
  answerId: string
): StepResolution {
  const question = getQuestionById(questionId);
  if (!question) {
    throw new Error(`Question not found: ${questionId}`);
  }

  const selectedAnswer = question.answers.find((a) => a.id === answerId);
  if (!selectedAnswer) {
    throw new Error(`Answer '${answerId}' not found for question '${questionId}'`);
  }

  if (selectedAnswer.ending_id) {
    const ending = getEndingById(selectedAnswer.ending_id);
    if (!ending) {
      throw new Error(`Ending not found: ${selectedAnswer.ending_id}`);
    }
    return {
      type: 'ending',
      question,
      selectedAnswer,
      ending,
    };
  }

  if (selectedAnswer.next_question_id) {
    const nextQuestion = getQuestionById(selectedAnswer.next_question_id);
    if (!nextQuestion) {
      throw new Error(`Next question not found: ${selectedAnswer.next_question_id}`);
    }
    return {
      type: 'next_question',
      question,
      selectedAnswer,
      nextQuestion,
    };
  }

  throw new Error(`Answer '${answerId}' has neither ending_id nor next_question_id`);
}

export function createDecisionRecord(
  stepIndex: number,
  question: Question,
  selectedAnswer: AnswerOption,
  resourcesBefore: Resources,
  resourcesAfter: Resources
): DecisionRecord {
  return {
    stepIndex,
    questionId: question.id,
    questionText: question.question,
    stage: question.stage,
    selectedAnswerId: selectedAnswer.id,
    selectedAnswerText: selectedAnswer.text,
    resourcesBefore,
    resourcesAfter,
    consequenceSummary: selectedAnswer.consequence_summary,
    learningPoint: selectedAnswer.learning_point,
    timestamp: Date.now(),
  };
}
