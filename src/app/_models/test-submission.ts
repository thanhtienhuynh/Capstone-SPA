export interface TestSubmission {
  id: number;
  testId: number;
  submissionDate: Date;
  spentTime: number;
  numberOfRightAnswers: number;
  mark: number;
  numberOfQuestion: number;
  subjectId: number;
  resultQuestions: ResultQuestion[];
}

export interface ResultQuestion {
  id: number;
  result: string;
}