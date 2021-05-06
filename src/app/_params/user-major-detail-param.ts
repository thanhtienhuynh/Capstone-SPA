import { MarkParam } from "./mark-param";

export class AddUserMajorDetailParam {
  universityId: number;
  trainingProgramId: number;
  majorId: number;
  subjectGroupId: number;
  totalMark: number;
  subjectGroupParam: MarkParam;
  constructor(universityId: number, trainingProgramId: number, majorId: number, subjectGroupId: number, subjectGroupParam: MarkParam, totalMark: number) {
    this.universityId = universityId;
    this.trainingProgramId = trainingProgramId;
    this.majorId = majorId;
    this.subjectGroupParam = subjectGroupParam;
    this.totalMark = totalMark;
    this.subjectGroupId = subjectGroupId;
  }
}

export class RemoveUserMajorDetailParam {
  universityId: number;
  trainingProgramId: number;
  majorId: number;

  constructor(universityId: number, trainingProgramId: number, majorId: number) {
    this.universityId = universityId;
    this.trainingProgramId = trainingProgramId;
    this.majorId = majorId;
  }
}