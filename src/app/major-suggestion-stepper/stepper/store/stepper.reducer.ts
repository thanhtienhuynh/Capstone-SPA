import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Major } from 'src/app/_models/major';
import { Mark } from 'src/app/_models/mark';
import { Province } from 'src/app/_models/province';
import { CusSubjectGroup, SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from 'src/app/_models/suggested-subjects-group';
import { Test } from 'src/app/_models/test';
import { TestSubmission } from 'src/app/_models/test-submission';
import { TranscriptType } from 'src/app/_models/transcript';
import { MockTestBasedUniversity, TrainingProgramBasedUniversity } from 'src/app/_models/university';
import { UnsaveTestSubmission, TestSubmissionParam } from 'src/app/_params/question-param';
import { Subject } from '../../../_models/subject';
import * as StepperActions from './stepper.actions';

export interface State {
  subjectGroups: CusSubjectGroup[];
  subjects: Subject[];

  //Điểm user submit, MarkParam
  marks: Mark[];
  transcriptTypeId: number; //Type điểm lúc bấm suggest
  gender: number;
  provinceId: number;
  subjectGroupIds: number[];

  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  trainingProgramBasedUniversity: TrainingProgramBasedUniversity[];
  //List trường ứng với điểm thi thử
  mockTestBasedUniversity: MockTestBasedUniversity;
  tests: ClassifiedTests[];
  test: Test;
  followTranscriptTypeId: number;
  removeFollowingDetailId: number;
  //Khối chọn sau khi suggest
  selectedSubjectGroup: SuggestedSubjectsGroup;
  //Ngành chọn sau khi suggest
  selectedMajor: Major;
  selectedUniversityId: number;
  //param follow
  selectedTrainingProgramId: number;
  position: number;
  selectedTestId: number;
  unsaveTestSubmissions: UnsaveTestSubmission[];
  //Param lúc chấm điểm
  testSubmissionParam: TestSubmissionParam;
  testSubmissionReponse: TestSubmission;
  //Lưu bài thi thành công
  isSubmissionSaved: boolean;
  //Bài thi cần phải làm
  needDoneTestIds: number[];
  //Tỉnh
  provinces: Province[];
  //Khi nào cần load uni base on mocktest
  shouldLoadMockTestUniversities: boolean;
  testSubmissionId: number;
  isDoingTest: boolean;
  userSuggestionSubjectGroup: UserSuggestionSubjectGroup;
  actionsQueue: StepperActions.StepperActions[];
  errors: string[];
}

const initialState: State = {
  subjectGroups: [],
  subjects: [],
  marks: [],
  subjectGroupIds: [],
  suggestedSubjectsGroup: [],
  trainingProgramBasedUniversity: [],
  mockTestBasedUniversity: null,
  tests: [],
  test: null,
  transcriptTypeId: null,
  followTranscriptTypeId: null,
  removeFollowingDetailId: null,
  gender: null,
  provinceId: null,
  selectedSubjectGroup: null,
  selectedMajor: null,
  selectedUniversityId: null,
  selectedTrainingProgramId: null,
  position: null,
  selectedTestId: null,
  testSubmissionParam: null,
  testSubmissionReponse: null,
  unsaveTestSubmissions: [],
  isSubmissionSaved: false,
  shouldLoadMockTestUniversities: false,
  isDoingTest: false,
  provinces: [],
  needDoneTestIds: [],
  testSubmissionId: null,
  userSuggestionSubjectGroup: null,
  actionsQueue: [],
  errors: null
};

export function stepReducer(
  state = initialState,
  action: StepperActions.StepperActions
) {
  let tempActions = [...state.actionsQueue];
  switch (action.type) {
    case StepperActions.LOAD_SUBJECT_GROUPS:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_SUBJECT_GROUPS:
      tempActions.splice( tempActions.findIndex(a => a.type == StepperActions.LOAD_SUBJECT_GROUPS), 1);
      return {
        ...state,
        subjectGroups: [...action.payload],
        actionsQueue: [...tempActions],
      };
    case StepperActions.LOAD_SUBJECTS:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_SUBJECTS:
      tempActions.splice( tempActions.findIndex(a => a.type == StepperActions.LOAD_SUBJECTS), 1);
      return {
        ...state,
        subjects: [...action.payload],
        actionsQueue: [...tempActions],
      };
    case StepperActions.SET_MARKS:
      return {
        ...state,
        suggestedSubjectsGroup: null,
        trainingProgramBasedUniversity: [],
        tests: [],
        test: null,
        marks: [...action.payload.marks],
        subjectGroupIds: [...action.payload.subjectGroupIds],
        transcriptTypeId: action.payload.transcriptTypeId,
        gender: action.payload.gender,
        provinceId: action.payload.provinceId,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SAVE_MARKS:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_SUGGESTED_SUBJECT_GROUPS:
      tempActions.splice( tempActions.findIndex(a => a.type == StepperActions.SET_MARKS), 1);
      return {
        ...state,
        suggestedSubjectsGroup: action.payload,
        actionsQueue: [...tempActions],
      };
    case StepperActions.SET_SELECTED_SUGGESTED_SUBJECTGROUP:
      return {
        ...state,

        selectedSubjectGroup: action.payload,
      };
    case StepperActions.LOAD_MAJORS_SELECTED_SUBJECT_GROUP:
      return {
        ...state,
        transcriptTypeId: 3,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_MAJORS_SELECTED_SUBJECT_GROUP:
      tempActions.splice( tempActions.findIndex(a => a.type == StepperActions.LOAD_MAJORS_SELECTED_SUBJECT_GROUP), 1);
      return {
        ...state,
        suggestedSubjectsGroup: action.payload,
        actionsQueue: [...tempActions],
      };
    case StepperActions.LOAD_UNIVERSIIES:
      return {
        ...state,
        trainingProgramBasedUniversity: [],    
        mockTestBasedUniversity: null,
        shouldLoadMockTestUniversities: false,
        selectedSubjectGroup: action.payload.subjectGroup,
        selectedMajor: action.payload.major,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.RELOAD_UNIVERSIIES:
        return {
          ...state,
          actionsQueue: [...state.actionsQueue, action],
        };
    case StepperActions.SET_UNIVERSIIES:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.LOAD_UNIVERSIIES
                                                                || a.type == StepperActions.RELOAD_UNIVERSIIES), 1);
      return {
        ...state,
        trainingProgramBasedUniversity: action.payload,
        test: null,
        actionsQueue: [...tempActions],
      };
    case StepperActions.LOAD_TESTS:
      return {
        ...state,
        test: null,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_TESTS:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.LOAD_TESTS), 1);
      let needDoneTestIds = action.payload.filter(t => t.lastTranscript == null).map(t => t.test.id);
      return {
        ...state,
        tests: action.payload,
        needDoneTestIds: needDoneTestIds,
        actionsQueue: [...tempActions],
      };
    case StepperActions.LOAD_TEST:
      return {
        ...state,
        test: null,
        testSubmissionParam: null,
        testSubmissionReponse: null,
        testSubmissionId: null,
        isSubmissionSaved: false,
        selectedTestId: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_TEST:
      const tempIds = state.needDoneTestIds.slice();
      const dupIndex = tempIds.indexOf(action.payload.id);
      tempIds.splice(dupIndex, 1);
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.LOAD_TEST), 1);
      return {
        ...state,
        test: action.payload,
        isDoingTest: true,
        needDoneTestIds: [...tempIds],
        actionsQueue: [...tempActions, action],
      };
    case StepperActions.REFRESH_TEST:
      return {
        ...state,
        test: null,
        selectedTestId: null,
        testSubmissionReponse: null,
        isSubmissionSaved: false,
        isDoingTest: false,
        tests: []
      };
    case StepperActions.SCORING_TEST:
      return {
        ...state,
        testSubmissionParam: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SET_TEST_MARK:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.SCORING_TEST), 1);
      let testParam = state.testSubmissionParam;
      var unsaveTestSubmission = new UnsaveTestSubmission(
        action.payload.testId,
        action.payload.spentTime,
        testParam.questions,
        action.payload.mark,
        action.payload.numberOfRightAnswers,
        state.testSubmissionId
      )
      var  unsaveTestSubmissions = [...state.unsaveTestSubmissions, unsaveTestSubmission];
      return {
        ...state,
        testSubmissionReponse: action.payload,
        unsaveTestSubmissions: [...unsaveTestSubmissions],
        actionsQueue: [...tempActions],
      };
    case StepperActions.SAVE_UNSAVE_TEST_SUBMISSIONS:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.SAVE_UNSAVE_TEST_SUBMISSIONS_SUCCESS:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.SAVE_UNSAVE_TEST_SUBMISSIONS), 1);
      return {
        ...state,
        isSubmissionSaved: true,
        isDoingTest: false,
        unsaveTestSubmissions: [],
        actionsQueue: [...tempActions],
      };
    case StepperActions.CARING_ACTION:
      return {
        ...state,
        selectedUniversityId: action.payload.universityId,
        selectedTrainingProgramId: action.payload.trainingProgramId,
        followTranscriptTypeId: action.payload.followTranscriptTypeId,
        position: action.payload.position,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.CARING_ACTION_SUCCESS:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.CARING_ACTION), 1);
      return {
        ...state,
        actionsQueue: [...tempActions],
      };
    case StepperActions.UNCARING_ACTION:
      return {
        ...state,
        removeFollowingDetailId: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case StepperActions.UNCARING_ACTION_SUCCESS:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.UNCARING_ACTION), 1);
      return {
        ...state,
        actionsQueue: [...tempActions],
      };
    case StepperActions.LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS:
      return {
        ...state,
        mockTestBasedUniversity: null,
        actionsQueue: [...state.actionsQueue, action],
      };  
    case StepperActions.SET_UNIVERSIIES_AFTER_DOING_MOCK_TESTS:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS), 1);
      return {
        ...state,
        shouldLoadMockTestUniversities: true,
        mockTestBasedUniversity: action.payload,
        actionsQueue: [...tempActions],
      };  
    case StepperActions.LOAD_USER_SUGGESTION:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };  
    case StepperActions.SET_USER_SUGGESTION:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.LOAD_USER_SUGGESTION), 1);
      return {
        ...state,
        userSuggestionSubjectGroup: action.payload,
        actionsQueue: [...tempActions],
      };  
    case StepperActions.LOAD_PROVINCES:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };  
    case StepperActions.SET_PROVINCES:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.LOAD_PROVINCES), 1);
      return {
        ...state,
        provinces: action.payload,
        actionsQueue: [...tempActions],
      };
    case StepperActions.SET_TEST_SUBMISSION_ID:
      tempActions.splice(tempActions.findIndex(a => a.type == StepperActions.SET_TEST), 1);
      return {
        ...state,
        testSubmissionId: action.payload,
        actionsQueue: [...tempActions],
      };
    case StepperActions.DONE_LOADING:
      tempActions.splice(tempActions.findIndex(a => a.type == action.payload), 1);
      return {
        ...state,
        actionsQueue: [...tempActions],
      };
    case StepperActions.HAS_ERRORS:
      tempActions.splice(tempActions.findIndex(a => a.type == action.payload.action), 1);
      return {
        ...state,
        errors: action.payload.messages,
        actionsQueue: [...tempActions]
      };
    case StepperActions.CONFIRM_ERRORS:
      return {
        ...state,
        errors: null,
      };
    case StepperActions.RESET_STATE:
      return {
        ...state, ...initialState
      };
    default:
      return state;
  }
}
