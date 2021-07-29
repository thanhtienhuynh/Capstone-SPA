import { Season } from "./university";

export interface RankingUserInformationGroupByTranscriptType {
  id: number;
  name: string;
  rankingUserInformations: RankingUserInformation[];
}

export interface RankingUserInformation {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  avatarUrl: string;
  groupCode: string;
  position: number;
  totalMark: number;
}

export interface UserFollowingDetail {
  trainingProgramDataSet: TrainingProgramDataSet;
  majorDataSet: MajorDataSet;
  universityDataSet: UniversityDataSet;
  rankingInformation: RankingInformation;
  rankingUserInformationsGroupByTranscriptType: RankingUserInformationGroupByTranscriptType[];
}

export interface TrainingProgramDataSet {
  id: number;
  name: string;
}

export interface MajorDataSet {
  id: number;
  name: string;
  code: string;
}

export interface UniversityDataSet {
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

export interface RankingInformation {
  seasonDataSets: Season[]
  positionOfUser: number;
  totalUserCared: number;
  subjectGroupId: number;
  subjectGroupCode: string;
  rankingMark: number;
}