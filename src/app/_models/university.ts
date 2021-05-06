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

export interface UniversityBaseOnTrainingProgram {
  id: number;
  name: string;
  universities: University[];
}
