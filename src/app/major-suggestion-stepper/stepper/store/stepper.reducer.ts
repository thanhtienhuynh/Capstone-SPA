import { act } from '@ngrx/effects';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Mark } from 'src/app/_models/mark';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import { Test } from 'src/app/_models/test';
import { TestSubmission } from 'src/app/_models/test-submission';
import { University, UniversityBaseOnTrainingProgram } from 'src/app/_models/university';
import { TestSubmissionParam } from 'src/app/_params/question-param';
import { Subject } from '../../../_models/subject';
import * as StepperActions from './stepper.actions';

export interface State {
  subjects: Subject[];
  marks: Mark[];
  isLoading: boolean;
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  universitiesBaseOnTrainingProgram: UniversityBaseOnTrainingProgram[];
  tests: ClassifiedTests[];
  test: Test;
  totalMark: number;
  selectedGroupId: number;
  selectedMajorId: number;
  selectedUniversityId: number;
  selectedTrainingProgramId: number;
  selectedTestId: number;
  testSubmissionParam: TestSubmissionParam;
  testSubmissionReponse: TestSubmission;
  isSubmissionSaved: boolean;
  isMarkSaved: boolean;
  errorMessage: string;
}

const initialState: State = {
  subjects: [],
  isLoading: false,
  marks: [],
  suggestedSubjectsGroup: [],
  universitiesBaseOnTrainingProgram: [],
  tests: [],
  test: null,
  totalMark: null,
  selectedGroupId: null,
  selectedMajorId: null,
  selectedUniversityId: null,
  selectedTrainingProgramId: null,
  selectedTestId: null,
  testSubmissionParam: null,
  testSubmissionReponse: null,
  isSubmissionSaved: false,
  isMarkSaved: false,
  errorMessage: null
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
        universitiesBaseOnTrainingProgram: [],
        tests: [],
        test: null,
        isLoading: true,
        marks: [...action.payload],
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
        totalMark: action.payload.totalMark,
        selectedGroupId: action.payload.subjectGroupId,
        selectedMajorId: action.payload.majorId,
      };
    case StepperActions.SET_UNIVERSIIES:
      return {
        ...state,
        universitiesBaseOnTrainingProgram: action.payload,
        isLoading: false,
        tests: [],
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
      return {
        ...state,
        test: action.payload,
        isLoading: false,
      };
    case StepperActions.REFRESH_TEST:
      return {
        ...state,
        test: null,
        selectedTestId: null,
        testSubmissionParam: null,
        testSubmissionReponse: null,
        isSaved: false,
        isLoading: false,
      };
    case StepperActions.SCORING_TEST:
      return {
        ...state,
        testSubmissionParam: action.payload,
        isLoading: true,
      };
    case StepperActions.SET_TEST_MARK:
      return {
        ...state,
        testSubmissionReponse: action.payload,
        isLoading: false,
      };
    case StepperActions.SAVE_TEST_SUBMISSION:
      return {
        ...state,
        isLoading: true,
      };
    case StepperActions.SAVE_TEST_SUBMISSION_SUCCESS:
      return {
        ...state,
        isSaved: action.payload,
        isLoading: false,
      };
    case StepperActions.CARING_ACTION:
      return {
        ...state,
        isLoading: true,
        selectedUniversityId: action.payload.universityId,
        selectedTrainingProgramId: action.payload.trainingProgramId
      };
    case StepperActions.CARING_ACTION_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case StepperActions.CARING_ACTION_UNSUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    case StepperActions.UNCARING_ACTION:
      return {
        ...state,
        isLoading: true,
        selectedUniversityId: action.payload.universityId,
        selectedTrainingProgramId: action.payload.trainingProgramId
      };
    case StepperActions.UNCARING_ACTION_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case StepperActions.UNCARING_ACTION_UNSUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    case StepperActions.RESET_STATE:
      return {
        ...state, ...initialState
      };
    default:
      return state;
  }
}
