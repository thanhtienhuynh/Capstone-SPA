import { CollapseArticle } from 'src/app/_models/collapse-article';
import { MajorBasedFollowingDetail } from 'src/app/_models/major-based-following-detail';
import { RankingUserInformationGroupByTranscriptType } from 'src/app/_models/ranking-user-information';
import { SelectedFollowingDetail } from 'src/app/_models/selected-following-detail';
import { TranscriptType } from 'src/app/_models/transcript';
import { UniversityBasedFollowingDetail } from 'src/app/_models/university-based-following-detail';
import { UserDetailTestSubmission, UserTestSubmission } from 'src/app/_models/user-test-submission';
import * as UserActions from './user.actions';

export interface State {
  isLoading: boolean;
  testSubmissions: UserTestSubmission[];
  detailTestSubmission: UserDetailTestSubmission;
  selectedTestSubmissionId: number;
  majorBasedFollowingDetails: MajorBasedFollowingDetail[];
  universityBasedFollowingDetails: UniversityBasedFollowingDetail[];
  selectedFollowingDetail: SelectedFollowingDetail;
  rankingUserInformationGroupByRankTypes: RankingUserInformationGroupByTranscriptType[];
  transcripts: TranscriptType[];
  caringArticles: CollapseArticle[];
  notiArticleIds: number[];
  errors: string[];
  uncaringFollowingDetailId: number;
  uncareType: number;
}

const initialState: State = {
  isLoading: false,
  testSubmissions: null,
  detailTestSubmission: null,
  selectedTestSubmissionId: null,
  majorBasedFollowingDetails: null,
  universityBasedFollowingDetails: null,
  selectedFollowingDetail: null,
  rankingUserInformationGroupByRankTypes: [],
  caringArticles: [],
  transcripts: [],
  notiArticleIds: [],
  uncaringFollowingDetailId: null,
  uncareType: null,
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
    case UserActions.LOAD_MAJOR_BASED_FOLLOWING_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_MAJOR_BASED_FOLLOWING_DETAILS:
      return {
        ...state,
        isLoading: false,
        majorBasedFollowingDetails: action.payload
      };
    case UserActions.LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_UNIVERSITY_BASED_FOLLOWING_DETAILS:
      return {
        ...state,
        isLoading: false,
        universityBasedFollowingDetails: action.payload
      };
    case UserActions.SET_DETAIL_FOLLOWING_DETAIL:
      return {
        ...state,
        selectedFollowingDetail: action.payload
      };
    case UserActions.LOAD_RANKING_USER_INFORMATION:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_RANKING_USER_INFORMATION:
      return {
        ...state,
        isLoading: false,
        rankingUserInformationGroupByRankTypes: action.payload
      }
    case UserActions.LOAD_TRANSCRIPTS:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_TRANSCRIPTS:
      return {
        ...state,
        isLoading: false,
        transcripts: action.payload
      }
    case UserActions.LOAD_CARING_ARTICLES:
      return {
        ...state,
        isLoading: true
      };
    case UserActions.SET_CARING_ARTICLES:
      return {
        ...state,
        isLoading: false,
        caringArticles: action.payload
      }
    case UserActions.SET_NOTIFICATION_ARTICLE_IDS:
      return {
        ...state,
        notiArticleIds: [...state.notiArticleIds, action.payload]
      }
    case UserActions.UNCARING_ACTION:
        return {
          ...state,
          isLoading: false,
          uncaringFollowingDetailId: action.payload.followingDetailId,
          uncareType: action.payload.uncaringType
        }
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
