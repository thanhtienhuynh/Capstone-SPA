import { Mark } from "../_models/mark";

export class MarkParam {
  marks: Mark[];
  transcriptTypeId: number;
  constructor(marks: Mark[], transcriptTypeId: number) {
    this.marks = marks;
    this.transcriptTypeId = transcriptTypeId;
  }
}