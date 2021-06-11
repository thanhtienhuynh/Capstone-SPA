export interface TrainingProgram {
  id: number;
  name: string;
  numberOfCaring: number;
  followingDetail: FollowingDetail;
  rank: number;
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