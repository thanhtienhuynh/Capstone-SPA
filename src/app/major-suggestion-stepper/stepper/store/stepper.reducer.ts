import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Major } from 'src/app/_models/major';
import { Mark } from 'src/app/_models/mark';
import { Province } from 'src/app/_models/province';
import { SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from 'src/app/_models/suggested-subjects-group';
import { Test } from 'src/app/_models/test';
import { TestSubmission } from 'src/app/_models/test-submission';
import { TranscriptType } from 'src/app/_models/transcript';
import { MockTestBasedUniversity, TrainingProgramBasedUniversity } from 'src/app/_models/university';
import { UnsaveTestSubmission, TestSubmissionParam } from 'src/app/_params/question-param';
import { Subject } from '../../../_models/subject';
import * as StepperActions from './stepper.actions';

export interface State {
  subjects: Subject[];
  marks: Mark[];
  testMarks: Mark[];
  isLoading: boolean;
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  trainingProgramBasedUniversity: TrainingProgramBasedUniversity[];
  mockTestBasedUniversity: MockTestBasedUniversity;
  tests: ClassifiedTests[];
  test: Test;
  transcriptTypeId: number;
  followTranscriptTypeId: number;
  removeFollowingDetailId: number;
  gender: number;
  provinceId: number;
  selectedSubjectGroup: SuggestedSubjectsGroup;
  selectedMajor: Major;
  selectedUniversityId: number;
  selectedTrainingProgramId: number;
  selectedTestId: number;
  unsaveTestSubmissions: UnsaveTestSubmission[];
  testSubmissionParam: TestSubmissionParam;
  testSubmissionReponse: TestSubmission;
  isSubmissionSaved: boolean;
  isMarkSaved: boolean;
  doneTestIds: number[];
  provinces: Province[];
  userSuggestionSubjectGroup: UserSuggestionSubjectGroup;
  errors: string[];
}

const initialState: State = {
  subjects: [],
  isLoading: false,
  marks: [],
  testMarks: [],
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
  selectedTestId: null,
  testSubmissionParam: null,
  testSubmissionReponse: null,
  unsaveTestSubmissions: [],
  isSubmissionSaved: false,
  isMarkSaved: false,
  provinces: [],
  doneTestIds: [],
  userSuggestionSubjectGroup: null,
  errors: null
};

export function stepReducer(
  state = initialState,
  action: StepperActions.StepperActions
) {
  switch (action.type) {
    case StepperActions.LOAD_SUBJECTS:
      return {
        ...state,
        isLoading: true,
      };
    case StepperActions.SET_SUBJECTS:
      return {
        ...state,
        subjects: [...action.payload],
        isLoading: false,
      };
    case StepperActions.SET_MARKS:
      return {
        ...state,
        suggestedSubjectsGroup: null,
        trainingProgramBasedUniversity: [],
        tests: [],
        test: null,
        isLoading: true,
        marks: [...action.payload.marks],
        transcriptTypeId: action.payload.transcriptTypeId,
        gender: action.payload.gender,
        provinceId: action.payload.provinceId
      };
    case StepperActions.SET_SUGGESTED_SUBJECTS_GROUP:
      return {
        ...state,
        suggestedSubjectsGroup: action.payload,
        isLoading: false,
      };
    case StepperActions.LOAD_UNIVERSIIES:
      return {
        ...state,
        isLoading: true,
        trainingProgramBasedUniversity: [],    
        mockTestBasedUniversity: null,    
        selectedSubjectGroup: action.payload.subjectGroup,
        selectedMajor: action.payload.major,
      };
    case StepperActions.SET_UNIVERSIIES:
      return {
        ...state,
        trainingProgramBasedUniversity: action.payload,
        isLoading: false,
        // tests: [],
        test: null,
      };
    case StepperActions.LOAD_TESTS:
      return {
        ...state,
        isLoading: true,
        test: null,
      };
    case StepperActions.SET_TESTS:
      return {
        ...state,
        tests: action.payload,
        isLoading: false,
      };
    case StepperActions.LOAD_TEST:
      return {
        ...state,
        selectedTestId: action.payload,
        isLoading: true,
      };
    case StepperActions.SET_TEST:
      const tempIds =  [...state.doneTestIds, action.payload.id];
      return {
        ...state,
        test: action.payload,
        doneTestIds: tempIds.filter((v,i) => tempIds.indexOf(v) === i),
        isLoading: false,
      };
    case StepperActions.REFRESH_TEST:
      return {
        ...state,
        test: null,
        selectedTestId: null,
        testSubmissionParam: null,
        testSubmissionReponse: null,
        isSubmissionSaved: false,
        isLoading: false,
      };
    case StepperActions.SCORING_TEST:
      return {
        ...state,
        testSubmissionParam: action.payload,
        isLoading: true,
      };
    case StepperActions.SET_TEST_MARK:
      var testMarks = state.testMarks;
      var testMark = testMarks.find(x => x.subjectId == action.payload.subjectId);
      if (testMark) {
        testMarks = testMarks.map(s => {
          if (s.subjectId == action.payload.subjectId) {
            s =  {...s, mark: action.payload.mark}
          }
          return s;
        })
      } else {
        testMarks = [...testMarks, {subjectId: action.payload.subjectId, mark: action.payload.mark}];
      }
      let testParam = state.testSubmissionParam;
      var unsaveTestSubmission = new UnsaveTestSubmission(
        action.payload.testId,
        action.payload.spentTime,
        testParam.questions,
        action.payload.mark,
        action.payload.numberOfRightAnswers
      )
      var unsaveTestSubmissions = state.unsaveTestSubmissions;
      var temp = unsaveTestSubmissions.find(x => x.testId == action.payload.testId);
      if (temp) {
        unsaveTestSubmissions = unsaveTestSubmissions.map(s => {
          if (s.testId == action.payload.testId) {
            s =  unsaveTestSubmission;
          }
          return s;
        })
      } else {
        unsaveTestSubmissions = [...unsaveTestSubmissions, unsaveTestSubmission];
      }
      return {
        ...state,
        testSubmissionReponse: action.payload,
        testMarks: [...testMarks],
        unsaveTestSubmissions: [...unsaveTestSubmissions],
        isLoading: false,
      };
    case StepperActions.SAVE_UNSAVE_TEST_SUBMISSIONS:
      return {
        ...state,
        isLoading: true
      };
    case StepperActions.SAVE_UNSAVE_TEST_SUBMISSIONS_SUCCESS:
      return {
        ...state,
        isSubmissionSaved: true,
        isLoading: false,
        unsaveTestSubmissions: []
      };
    case StepperActions.CARING_ACTION:
      return {
        ...state,
        isLoading: true,
        selectedUniversityId: action.payload.universityId,
        selectedTrainingProgramId: action.payload.trainingProgramId,
        followTranscriptTypeId: action.payload.followTranscriptTypeId
      };
    case StepperActions.CARING_ACTION_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case StepperActions.UNCARING_ACTION:
      return {
        ...state,
        isLoading: true,
        removeFollowingDetailId: action.payload
      };
    case StepperActions.UNCARING_ACTION_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case StepperActions.LOAD_UNIVERSIIES_AFTER_DOING_MOCK_TESTS:
      return {
        ...state,
        isLoading: true,
      };  
    case StepperActions.SET_UNIVERSIIES_AFTER_DOING_MOCK_TESTS:
      return {
        ...state,
        mockTestBasedUniversity: action.payload,
        isLoading: false,
      };  
    case StepperActions.LOAD_USER_SUGGESTION:
      return {
        ...state,
        isLoading: true,
      };  
    case StepperActions.SET_USER_SUGGESTION:
      return {
        ...state,
        userSuggestionSubjectGroup: action.payload,
        isLoading: false
      };  
    case StepperActions.LOAD_PROVINCES:
      return {
        ...state,
        isLoading: true,
      };  
    case StepperActions.SET_PROVINCES:
      return {
        ...state,
        provinces: action.payload,
        isLoading: false
      };  
    case StepperActions.HAS_ERRORS:
      return {
        ...state,
        errors: action.payload,
        isLoading: false
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
