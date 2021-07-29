export interface TrainingProgram {
  id: number;
  name: string;
  numberOfCaring: number;
  followingDetail: FollowingDetail;
  rank: number;
  ratio: number;
  dividedClass: number;
  seasonDataSets: Season[];
}

export interface FollowingDetail {
  id: number;
  userId: number;
  entryMarkId: number;
  isReceiveNotification: boolean;
}

export interface TrainingProgramBasedUniversity {
  id: number;
  code: string;
  name: string;
  address: string;
  logoUrl: string;
  description: string;
  phone: string;
  webUrl: string;
  tuitionFrom: number;
  tuitionType: number;
  tuitionTo: number;
  rating: number;
  trainingProgramSets: TrainingProgram[];
}

export interface Season {
  id: number;
  name: string;
  numberOfStudents: number;
  entryMark: number;
}

export interface University {
  id: number;
  code: string;
  name: string;
  address: string;
  logoUrl: string;
  description: string;
  rating: number;
  tuitionFrom: number;
  tuitionType: number;
  tuitionTo: number;
  webUrl: string;
  phone: string;
  nearestYearEntryMark: number;
  numberOfStudents: number;
  numberOfCaring: number;
  isCared: boolean;
  rank: number;
}

export interface MockTestBasedUniversity {
  majorId: number;
  subjectGroupId: number;
  totalMark: number;
  trainingProgramBasedUniversityDataSets: TrainingProgramBasedUniversity[]
}

export interface CusUniversity {
  id: number;
  code: string;
  name: string;
  address: string;
  logoUrl: string;
  description: string;
  rating: number;
  tuitionFrom: number;
  tuitionType: number;
  tuitionTo: number;
  webUrl: string;
  phone: string;
}

export class CusUniversityMajorDetail {
  universityId: number;
  majorId: number;
  majorCode: string;
  majorName: string;
  majorDetailUnies: CusMajorDetail[];
  rows: number = 0;
}

export class CusMajorDetail
{
  id: number;
  trainingProgramId: number;
  trainingProgramName: string;
  admissionQuantity: number;
  majorDetailCode: string;
  seasonId: number;
  seasonName: string;
  majorDetailSubAdmissions: CusSubAdmission[];
  rows: number;
}

export class CusSubAdmission
{
  id: number;
  quantity: number;
  genderId: number;
  admissionMethodId: number;
  admissionMethodName: string;
  provinceId: number;
  provinceName: number;
  majorDetailEntryMarks: CusEntryMark[]
  rows: number;
}

export class CusEntryMark
{
  id: number;
  mark: number;
  majorSubjectGoupId: number;
  subjectGroupId: number;
  subjectGroupCode: string;
  rows: number;
}

export class MajorDetailFilter {
  universityId: number;
  seasonId: number;
  majorCode: string;
  majorName: string;
  order: number;

  constructor({universityId, seasonId, majorCode, majorName, order}) {
    this.universityId = universityId;
    this.seasonId = seasonId;
    this.majorCode = majorCode;
    this.order = order;
    this.majorName = majorName;
  }
}

export class Cell {
  rowspan: number;
  data: any;
  isNumber: boolean;
}

export class Row {
  cells: Cell[];
  isOdd: boolean;
}

export class UniSeason {
  id: number;
  name: string;
  fromDate: Date;
  toDate: Date;
  status: number;
}