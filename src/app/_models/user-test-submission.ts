import { Option } from "./option";

export interface UserTestSubmission {
  id: number;
  testId: number;
  testName: string;
  submissionDate: Date;
  spentTime: number;
  numberOfRightAnswers: number;
  mark: number;
  numberOfQuestion: number;
  timeLimit: number;
  numberOfCompletion: number;
}

export interface UserDetailTestSubmission {
  id: number;
  testId: number;
  testName: string;
  submissionDate: Date;
  spentTime: number;
  numberOfRightAnswers: number;
  mark: number;
  numberOfQuestion: number;
  timeLimit: number;
  numberOfCompletion: number;
  questionSubmissions: QuestionSubmission[];
  isSuggestedTest: boolean;
}

export interface QuestionSubmission {
  id: number;
  result: string;
  questionId: number;
  content: string;
  numberOfOption: number;
  rightResult: string;
  isAnnotate: boolean;
  realOrder: number;
  type: number;
  testId: number;
  options: Option[];
}

export class TestSubmissionDetailParam {
  subjectId: number;
  testTypeId: number;
  isSuggestedTest: boolean;
  order: number;
}