import { MajorBasedUserMajorDetail, TrainingProgramGroupByMajorDataSet, UniversityGroupByTrainingProgramDataSet } from "./major-based-user-major-detail";

export class SelectedUserMajorDetail {
  majorBasedUserMajorDetail: MajorBasedUserMajorDetail;
  trainingProgramGroupByMajorDataSet: TrainingProgramGroupByMajorDataSet;
  universityGroupByTrainingProgramDataSet: UniversityGroupByTrainingProgramDataSet;

  
  constructor({majorBasedUserMajorDetail, trainingProgramGroupByMajorDataSet,
    universityGroupByTrainingProgramDataSet}) {
    this.majorBasedUserMajorDetail = majorBasedUserMajorDetail;
    this.trainingProgramGroupByMajorDataSet = trainingProgramGroupByMajorDataSet;
    this.universityGroupByTrainingProgramDataSet = universityGroupByTrainingProgramDataSet;
  }

}