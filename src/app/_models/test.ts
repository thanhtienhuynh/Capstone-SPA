import { Question } from "./question";

export interface Test {
  id: number;
  name: string;
  level: number;
  timeLimit: number;
  numberOfQuestion: number;
  year: Date;
  createDate: Date;
  subjectId: number;
  testTypeId: number;
  universityId: number;
  questions: Question[];
}