import { Test } from "./test";

export interface ClassifiedTests {
  subjectId: number;
  universityId: number;
  daysRemaining: number;
  lastTranscript: number
  isDone: boolean;
  test: Test;
}