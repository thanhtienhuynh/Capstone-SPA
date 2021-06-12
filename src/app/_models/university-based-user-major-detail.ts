export interface UniversityBasedUserMajorDetail {
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
  id: number;
  majorCode: string;
  code: string;
  name: string;
  newestEntryMark: number;
  numberOfStudent: number;
  yearOfEntryMark: number;
  positionOfUser: number;
  totalUserCared: number;
  subjectGroupId: number;
  subjectGroupCode: string;
  rankingMark: number;
}

