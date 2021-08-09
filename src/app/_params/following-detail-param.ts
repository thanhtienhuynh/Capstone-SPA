import { MarkParam } from "./mark-param";

export class AddFollowingDetailParam {
  universityId: number;
  trainingProgramId: number;
  majorId: number;
  subjectGroupId: number;
  totalMark: number;
  position: number;
  subjectGroupParam: MarkParam;
  constructor(universityId: number, trainingProgramId: number, majorId: number, subjectGroupId: number,
    subjectGroupParam: MarkParam, totalMark: number, position: number) {
    this.universityId = universityId;
    this.trainingProgramId = trainingProgramId;
    this.majorId = majorId;
    this.subjectGroupParam = subjectGroupParam;
    this.totalMark = totalMark;
    this.subjectGroupId = subjectGroupId;
    this.position = position;
  }
}