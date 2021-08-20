import { Season } from "./university";

export interface MajorBasedFollowingDetail {
  id: number;
  code: string;
  name: string;
  trainingProgramGroupByMajorDataSets: TrainingProgramGroupByMajorDataSet[];
}

export interface TrainingProgramGroupByMajorDataSet {
  id: number;
  name: string;
  universityGroupByTrainingProgramDataSets: UniversityGroupByTrainingProgramDataSet[];

}

export interface UniversityGroupByTrainingProgramDataSet {
  followingDetailId: number;
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
  majorCode: string;
  seasonDataSets: Season[];
  otherSubjectGroups: OtherSubjectGroup[];
  positionOfUser: number;
  totalUserCared: number;
  subjectGroupId: number;
  subjectGroupCode: string;
  rankingMark: number;
}

export interface OtherSubjectGroup {
  id: number;
  name: string;
  rankTypeId: number;
  mark: number;
}