import { CollapseArticle } from 'src/app/_models/collapse-article';
import { MajorBasedFollowingDetail } from 'src/app/_models/major-based-following-detail';
import { NotificationDataSet } from 'src/app/_models/notification';
import { PagedResponse } from 'src/app/_models/paged-response';
import { RankingUserInformationGroupByTranscriptType, UserFollowingDetail } from 'src/app/_models/ranking-user-information';
import { TranscriptType } from 'src/app/_models/transcript';
import { UniversityBasedFollowingDetail } from 'src/app/_models/university-based-following-detail';
import { TestSubmissionDetailParam, UserDetailTestSubmission, UserTestSubmission } from 'src/app/_models/user-test-submission';
import * as UserActions from './user.actions';

export interface State {
  testSubmissions: UserTestSubmission[];
  detailTestSubmission: UserDetailTestSubmission;
  selectedTestSubmissionId: number;
  majorBasedFollowingDetails: MajorBasedFollowingDetail[];
  universityBasedFollowingDetails: UniversityBasedFollowingDetail[];
  userFollowingDetail: UserFollowingDetail;
  selectedFollowingDetailId: number;
  transcripts: TranscriptType[];
  caringArticles: CollapseArticle[];
  notiArticleIds: number[];
  testSubmissionParam: TestSubmissionDetailParam;
  pagedNotifications: PagedResponse<NotificationDataSet[]>;
  notifcationtions: NotificationDataSet[];
  errors: string[];
  uncaringFollowingDetailId: number;
  uncareType: number;
  markAsReadId: number;
  countUnread: number;
  actionsQueue: UserActions.UserActions[];
}

const initialState: State = {
  testSubmissions: null,
  detailTestSubmission: null,
  selectedTestSubmissionId: null,
  majorBasedFollowingDetails: null,
  universityBasedFollowingDetails: null,
  userFollowingDetail: null,
  selectedFollowingDetailId: null,
  caringArticles: [],
  transcripts: [],
  notiArticleIds: [],
  uncaringFollowingDetailId: null,
  testSubmissionParam: null,
  uncareType: null,
  pagedNotifications: null,
  notifcationtions: [],
  markAsReadId: null,
  countUnread: null,
  errors: null,
  actionsQueue: []
};

export function userReducer(
  state = initialState,
  action: UserActions.UserActions
) {
  let tempActions = [...state.actionsQueue];
  switch (action.type) {
    case UserActions.LOAD_SUBMISSIONS:
      return {
        ...state,
        testSubmissions: [],
        testSubmissionParam: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case UserActions.SET_SUBMISSIONS:
      tempActions.splice( tempActions.findIndex(a => a.type == UserActions.LOAD_SUBMISSIONS), 1);
      return {
        ...state,
        testSubmissions: action.payload,
        actionsQueue: [...tempActions],
      };
    case UserActions.LOAD_DETAIL_SUBMISSION:
      return {
        ...state,
        detailTestSubmission: null,
        selectedTestSubmissionId: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case UserActions.SET_DETAIL_SUBMISSION:
      tempActions.splice( tempActions.findIndex(a => a.type == UserActions.LOAD_DETAIL_SUBMISSION), 1);
      return {
        ...state,
        detailTestSubmission: action.payload,
        actionsQueue: [...tempActions],
      };
    case UserActions.LOAD_MAJOR_BASED_FOLLOWING_DETAILS:
      return {
        ...state,
        majorBasedFollowingDetails: [],
        actionsQueue: [...state.actionsQueue, action],
      };
    case UserActions.SET_MAJOR_BASED_FOLLOWING_DETAILS:
      tempActions.splice( tempActions.findIndex(a => a.type == UserActions.LOAD_MAJOR_BASED_FOLLOWING_DETAILS), 1);
      return {
        ...state,
        majorBasedFollowingDetails: action.payload,
        actionsQueue: [...tempActions],
      };
    case UserActions.LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS:
      return {
        ...state,
        universityBasedFollowingDetails: [],
        actionsQueue: [...state.actionsQueue, action],
      };
    case UserActions.SET_UNIVERSITY_BASED_FOLLOWING_DETAILS:
      tempActions.splice( tempActions.findIndex(a => a.type == UserActions.LOAD_UNIVERSITY_BASED_FOLLOWING_DETAILS), 1);
      return {
        ...state,
        universityBasedFollowingDetails: action.payload,
        actionsQueue: [...tempActions],
      };
    case UserActions.LOAD_USER_FOLLOWING_DETAIL:
      return {
        ...state,
        userFollowingDetail: null,
        selectedFollowingDetailId: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case UserActions.SET_USER_FOLLOWING_DETAIL:
      tempActions.splice( tempActions.findIndex(a => a.type == UserActions.LOAD_USER_FOLLOWING_DETAIL), 1);
      return {
        ...state,
        userFollowingDetail: action.payload,
        actionsQueue: [...tempActions],
      }
    case UserActions.LOAD_TRANSCRIPTS:
      return {
        ...state,
        transcripts: [],
        actionsQueue: [...state.actionsQueue, action],
      };
    case UserActions.SET_TRANSCRIPTS:
      tempActions.splice( tempActions.findIndex(a => a.type == UserActions.LOAD_TRANSCRIPTS), 1);
      return {
        ...state,
        transcripts: action.payload,
        actionsQueue: [...tempActions],
      }
    case UserActions.LOAD_CARING_ARTICLES:
      return {
        ...state,
        caringArticles: [],
      };
    case UserActions.SET_CARING_ARTICLES:
      return {
        ...state,
        caringArticles: action.payload
      }
    case UserActions.SET_NOTIFICATION_ARTICLE_IDS:
      return {
        ...state,
        notiArticleIds: [...state.notiArticleIds, action.payload]
      }
    case UserActions.LOAD_NUMBER_OF_UNREAD_NOTIFICATIONS:
      return {
        ...state
      }
    case UserActions.SET_NUMBER_OF_UNREAD_NOTIFICATIONS:
      return {
        ...state,
        countUnread: action.payload,
      }
    case UserActions.MARK_AS_READ:
      return {
        ...state,
        markAsReadId: action.payload,
      }
    case UserActions.LOAD_NOTIFICATIONS:
      return {
        ...state,
        pagedNotifications: null,
        notifcationtions: [],
      }
    case UserActions.SET_NOTIFICATIONS:
      return {
        ...state,
        pagedNotifications: action.payload,
        notifcationtions: action.payload.data,
      }
    case UserActions.LOAD_MORE_NOTIFICATIONS:
      return {
        ...state
      }
    case UserActions.SET_MORE_NOTIFICATIONS:
      return {
        ...state,
        pagedNotifications: action.payload,
        notifcationtions: [...state.notifcationtions, ... action.payload.data]
      }
    case UserActions.UNCARING_ACTION:
      return {
        ...state,
        uncaringFollowingDetailId: action.payload.followingDetailId,
        uncareType: action.payload.uncaringType,
        actionsQueue: [...state.actionsQueue, action]
      }
    case UserActions.DONE_LOADING:
      tempActions.splice(tempActions.findIndex(a => a.type == action.payload), 1);
      return {
        ...state,
        actionsQueue: [...tempActions],
      };
    case UserActions.HAS_ERRORS:
      tempActions.splice(tempActions.findIndex(a => a.type == action.payload.action), 1);
      return {
        ...state,
        errors: action.payload.messages,
        actionsQueue: [...tempActions]
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
