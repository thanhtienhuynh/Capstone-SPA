export class TestSubmissionParam {
  testId: number;
  spentTime: number;
  questions: QuestionParam[];

  constructor(testId: number, spentTime: number, questions: QuestionParam[]) {
    this.testId = testId;
    this.spentTime = spentTime;
    this.questions = questions;
  }
}

export class UnsaveTestSubmission {
  testId: number;
  testSubmissionId: number;
  spentTime: number;
  questions: QuestionParam[];
  mark: number;
  numberOfRightAnswers: number;

  constructor(testId: number, spentTime: number, questions: QuestionParam[], mark: number,
              numberOfRightAnswers: number, testSubmissionId: number) {
    this.testId = testId;
    this.spentTime = spentTime;
    this.questions = questions;
    this.mark = mark;
    this.numberOfRightAnswers = numberOfRightAnswers;
    this.testSubmissionId = testSubmissionId;
  }
}

export class QuestionParam {
  id: number;
  options: string;

  constructor(id: number, options: string) {
    this.id = id;
    this.options = options;
  }
}