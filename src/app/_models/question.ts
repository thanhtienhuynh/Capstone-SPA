import { Option } from "./option";

export interface Question {
  id: number;
  questionContent: string;
  result: string;
  numberOfOption: number;
  type: number;
  testId: number;
  options: Option[];
}