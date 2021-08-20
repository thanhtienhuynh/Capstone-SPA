import { OtherSubjectGroup } from "./major-based-following-detail";
import { Season } from "./university";

export interface UniversityBasedFollowingDetail {
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
  trainingProgramGroupByUniversityDataSets: TrainingProgramGroupByUniversityDataSet[];
}

export interface TrainingProgramGroupByUniversityDataSet {
  id: number;
  name: string;
  majorGroupByTrainingProgramDataSets: MajorGroupByTrainingProgramDataSet[];
}

export interface MajorGroupByTrainingProgramDataSet {
  followingDetailId: number;
  id: number;
  majorCode: string;
  code: string;
  name: string;
  seasonDataSets: Season[];
  otherSubjectGroups: OtherSubjectGroup[];
  positionOfUser: number;
  totalUserCared: number;
  subjectGroupId: number;
  subjectGroupCode: string;
  rankingMark: number;
  rankTypeId: number;
}