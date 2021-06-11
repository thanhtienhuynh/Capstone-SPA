import { Option } from "./option";

export interface Question {
  id: number;
  content: string;
  isAnnotate: boolean;
  numberOfOption: number;
  type: number;
  testId: number;
  realOrder: number;
  options: Option[];
}