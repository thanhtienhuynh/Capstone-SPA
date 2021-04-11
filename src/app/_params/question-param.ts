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

export class SaveTestSubmissionParam {
  testId: number;
  spentTime: number;
  questions: QuestionParam[];
  mark: number;
  numberOfRightAnswers: number;
  majorId: number;
  universityId: number;

  constructor(testId: number, spentTime: number, questions: QuestionParam[], mark: number, numberOfRightAnswers: number,  majorId: number, universityId: number) {
    this.testId = testId;
    this.spentTime = spentTime;
    this.questions = questions;
    this.mark = mark;
    this.numberOfRightAnswers = numberOfRightAnswers;
    this.majorId = majorId;
    this.universityId = universityId;
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