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
}

export interface QuestionSubmission {
  id: number;
  result: string;
  questionId: number;
  questionContent: string;
  numberOfOption: number;
  rightResult: string;
  type: number;
  testId: number;
  options: Option[];
}