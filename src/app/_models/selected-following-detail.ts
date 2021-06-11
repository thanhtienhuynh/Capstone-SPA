import { MajorBasedFollowingDetail, TrainingProgramGroupByMajorDataSet, UniversityGroupByTrainingProgramDataSet } from "./major-based-following-detail";

export class SelectedFollowingDetail {
  majorBasedFollowingDetail: MajorBasedFollowingDetail;
  trainingProgramGroupByMajorDataSet: TrainingProgramGroupByMajorDataSet;
  universityGroupByTrainingProgramDataSet: UniversityGroupByTrainingProgramDataSet;

  constructor({majorBasedFollowingDetail, trainingProgramGroupByMajorDataSet,
    universityGroupByTrainingProgramDataSet}) {
    this.majorBasedFollowingDetail = majorBasedFollowingDetail;
    this.trainingProgramGroupByMajorDataSet = trainingProgramGroupByMajorDataSet;
    this.universityGroupByTrainingProgramDataSet = universityGroupByTrainingProgramDataSet;
  }

}