import { MajorBasedUserMajorDetail } from 'src/app/_models/major-based-user-major-detail';
import { SelectedUserMajorDetail } from 'src/app/_models/selected-user-major-detail';
import { UniversityBasedUserMajorDetail } from 'src/app/_models/university-based-user-major-detail';
import { UserDetailTestSubmission, UserTestSubmission } from 'src/app/_models/user-test-submission';
import * as UserActions from './user.actions';

export interface State {
  isLoading: boolean;
  testSubmissions: UserTestSubmission[];
  detailTestSubmission: UserDetailTestSubmission;
  selectedTestSubmissionId: number;
  majorBasedUserMajorDetails: MajorBasedUserMajorDetail[];
  universityBasedUserMajorDetails: UniversityBasedUserMajorDetail[];
  selectedUserMajorDetail: SelectedUserMajorDetail;
  errors: string[];
}

const initialState: State = {
  isLoading: false,
  testSubmissions: null,
  detailTestSubmission: null,
  selectedTestSubmissionId: null,
  majorBasedUserMajorDetails: null,
  universityBasedUserMajorDetails: null,
  selectedUserMajorDetail: null,
  errors: null,
};

export function userReducer(
  state = initialState,
  action: UserActions.UserActions
) {
  switch (action.type) {
    case UserActions.LOAD_SUBMISSIONS:
      return {
        ...state,
        isLoading: true,
      };
    case UserActions.SET_SUBMISSIONS:
      return {
        ...state,
        isLoading: false,
        testSubmissions: action.payload
      };
    case UserActions.LOAD_DETAIL_SUBMISSION:
      return {
        ...state,
        isLoading: true,
        selectedTestSubmissionId: action.payload
      };
    case UserActions.SET_DETAIL_SUBMISSION:
      return {
        ...state,
        isLoading: false,
        detailTestSubmission: action.payload
      };
    case UserActions.LOAD_MAJOR_BASED_USER_MAJOR_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_MAJOR_BASED_USER_MAJOR_DETAILS:
      return {
        ...state,
        isLoading: false,
        majorBasedUserMajorDetails: action.payload
      };
    case UserActions.LOAD_UNIVERSITY_BASED_USER_MAJOR_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_UNIVERSITY_BASED_USER_MAJOR_DETAILS:
      return {
        ...state,
        isLoading: false,
        universityBasedUserMajorDetails: action.payload
      };
    case UserActions.SET_DETAIL_USER_MAJOR_DETAIL:
      return {
        ...state,
        selectedUserMajorDetail: action.payload
      };
    case UserActions.HAS_ERRORS:
      return {
        ...state,
        errors: action.payload,
        isLoading: false
      };
    case UserActions.CONFIRM_ERRORS:
      return {
        ...state,
        errors: null,
      };
   
    default:
      return state;
  }
}
