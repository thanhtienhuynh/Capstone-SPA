import { User } from 'src/app/_models/user';
import { UserDetailTestSubmission, UserTestSubmission } from 'src/app/_models/user-test-submission';
import * as UserActions from './user.actions';

export interface State {
  isLoading: boolean;
  testSubmissions: UserTestSubmission[];
  detailTestSubmission: UserDetailTestSubmission;
  selectedTestSubmissionId: number;
}

const initialState: State = {
  isLoading: false,
  testSubmissions: null,
  detailTestSubmission: null,
  selectedTestSubmissionId: null
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
   
    default:
      return state;
  }
}
