export interface MajorBasedUserMajorDetail {
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
  newestEntryMark: number;
  numberOfStudent: number;
  yearOfEntryMark: number;
  positionOfUser: number;
  totalUserCared: number;
  subjectGroupId: number;
  subjectGroupCode: string;
  rankingMark: number;
}

