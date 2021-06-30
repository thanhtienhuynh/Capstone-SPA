import { Test } from "./test";

export interface ClassifiedTests {
  subjectId: number;
  universityId: number;
  isDone: boolean;
  tests: Test[];
}