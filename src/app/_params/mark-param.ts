import { Mark } from "../_models/mark";

export class MarkParam {
  marks: Mark[];
  subjectGroupIds: number[];
  transcriptTypeId: number;
  gender: number;
  provinceId: number;
  constructor(marks: Mark[], transcriptTypeId: number, gender: number, provinceId: number) {
    this.marks = marks;
    this.transcriptTypeId = transcriptTypeId;
    this.gender = gender;
    this.provinceId = provinceId;
  }
}