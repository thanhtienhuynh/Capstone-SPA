import { MarkParam } from "./mark-param";

export class AddUserMajorDetailParam {
  universityId: number;
  trainingProgramId: number;
  majorId: number;
  subjectGroupParam: MarkParam;
  constructor(universityId: number, trainingProgramId: number, majorId: number, subjectGroupParam: MarkParam) {
    this.universityId = universityId;
    this.trainingProgramId = trainingProgramId;
    this.majorId = majorId;
    this.subjectGroupParam = subjectGroupParam;
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