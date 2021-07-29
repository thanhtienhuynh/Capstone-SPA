import { CollapseArticle, HomeArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { CusMajor, CusMajorParam, CusSingleMajorDetail } from "src/app/_models/major";
import { PagedResponse } from "src/app/_models/paged-response";
import { Test } from "src/app/_models/test";
import { TestSubmission } from "src/app/_models/test-submission";
import { CusMajorDetail, CusUniversity, CusUniversityMajorDetail, MajorDetailFilter, UniSeason } from "src/app/_models/university";
import { PageParam } from "src/app/_params/page-param";
import { TestSubmissionParam, UnsaveTestSubmission } from "src/app/_params/question-param";
import * as HomeActions from '../store/home.actions';

export interface State {
  collapseArticlesPageResponse: PagedResponse<CollapseArticle[]>;
  collapseTestsPageResponse: PagedResponse<Test[]>;
  homeArticles: HomeArticle[];
  selectedTestId: number;
  selectedTest: Test;
  selectedArticleId: number;
  detailSelectedArticle: DetailArticle;
  testSubmissionParam: TestSubmissionParam;
  testSubmissionReponse: TestSubmission;
  universitiesPageResponse: PagedResponse<CusUniversity[]>;
  selectedUniversity: CusUniversity;
  selectedUniversityId: number;
  cusMajorDetailPageResponse: PagedResponse<CusUniversityMajorDetail[]>;
  majorDetailFilter: MajorDetailFilter;
  cusMajorDetailPageFilter: PageParam;
  cusMajorPageParam: PageParam;
  cusMajorPageResponse: PagedResponse<CusMajor[]>;
  cusMajorFilter: CusMajorParam;
  cusMajorDetail: CusSingleMajorDetail;
  selectedMajorId: number;
  seasons: UniSeason[];
  actionsQueue: HomeActions.HomeActions[];
  unsaveTestSubmissions: UnsaveTestSubmission[];
  isSubmissionSaved: boolean;
  errors: string[];
}

const initialState: State = {
  collapseArticlesPageResponse: null,
  selectedArticleId: null,
  detailSelectedArticle: null,
  homeArticles: [],
  collapseTestsPageResponse: null,
  testSubmissionParam: null,
  testSubmissionReponse: null,
  selectedTestId: null,
  selectedTest: null,
  universitiesPageResponse: null,
  selectedUniversity: null,
  selectedUniversityId: null,
  majorDetailFilter: null,
  cusMajorDetailPageResponse: null,
  cusMajorDetailPageFilter: null,
  cusMajorPageParam: null,
  cusMajorPageResponse: null,
  cusMajorFilter: null,
  cusMajorDetail: null,
  selectedMajorId: null,
  isSubmissionSaved: false,
  seasons: [],
  unsaveTestSubmissions: [],
  actionsQueue: [],
  errors: null
};

export function homeReducer(
  state = initialState,
  action: HomeActions.HomeActions
) {
  let tempActions = [...state.actionsQueue];
  switch (action.type) {
    case HomeActions.LOAD_COLLAPSE_ARTICLES:
      return {
        ...state,
        collapseArticlesPageResponse: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_COLLAPSE_ARTICLES:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_COLLAPSE_ARTICLES), 1);
      return {
        ...state,
        collapseArticlesPageResponse: action.payload,
        actionsQueue: [...tempActions],
      }
    case HomeActions.LOAD_DETAIL_ARTICLE:
      return {
        ...state,
        selectedArticleId: action.payload,
        detailSelectedArticle: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_DETAIL_ARTICLE:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_DETAIL_ARTICLE), 1);
      return {
        ...state,
        detailSelectedArticle: action.payload,
        actionsQueue: [...tempActions]
      }  
    case HomeActions.LOAD_TOP_ARTICLES:
      return {
        ...state,
        homeArticles: [],
        actionsQueue: [...state.actionsQueue, action],
      }  
      case HomeActions.SET_TOP_ARTICLES:
        tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_TOP_ARTICLES), 1);
      return {
        ...state,
        homeArticles: action.payload,
        actionsQueue: [...tempActions]
      }
    case HomeActions.LOAD_COLLAPSE_TESTS:
      return {
        ...state,
        collapseTestsPageResponse: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_COLLAPSE_TESTS:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_COLLAPSE_TESTS), 1);
      return {
        ...state,
        collapseTestsPageResponse: action.payload,
        actionsQueue: [...tempActions]
      }  
    case HomeActions.LOAD_DETAIL_TEST:
      return {
        ...state,
        selectedTestId: action.payload,
        selectedTest: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_DETAIL_TEST:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_DETAIL_TEST), 1);
      return {
        ...state,
        selectedTest: action.payload,
        actionsQueue: [...tempActions]
      }
    case HomeActions.SCORING_TEST:
      return {
        ...state,
        testSubmissionParam: action.payload,
        actionsQueue: [...state.actionsQueue, action],
      };
    case HomeActions.SET_TEST_MARK:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.SCORING_TEST), 1);
      let testParam = state.testSubmissionParam;
      var unsaveTestSubmission = new UnsaveTestSubmission(
        action.payload.testId,
        action.payload.spentTime,
        testParam.questions,
        action.payload.mark,
        action.payload.numberOfRightAnswers,
        state.selectedTestId
      );
      var unsaveTestSubmissions = [...state.unsaveTestSubmissions, unsaveTestSubmission];
      return {
        ...state,
        testSubmissionReponse: action.payload,
        unsaveTestSubmissions: [...unsaveTestSubmissions],
        actionsQueue: [...tempActions]
      };
    case HomeActions.SAVE_UNSAVE_TEST_SUBMISSIONS:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      };
    case HomeActions.SAVE_UNSAVE_TEST_SUBMISSIONS_SUCCESS:
      tempActions.splice(tempActions.findIndex(a => a.type == HomeActions.SAVE_UNSAVE_TEST_SUBMISSIONS), 1);
      return {
        ...state,
        isSubmissionSaved: true,
        unsaveTestSubmissions: [],
        actionsQueue: [...tempActions],
      };
    case HomeActions.LOAD_UNIVERSITIES:
      return {
        ...state,
        universitiesPageResponse: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_UNIVERSITIES: {
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_UNIVERSITIES), 1);
      return {
        ...state,
        universitiesPageResponse: action.payload,
        actionsQueue: [...tempActions]
      }
    }
    case HomeActions.LOAD_UNIVERSITY:
      return {
        ...state,
        selectedUniversityId: action.payload,
        selectedUniversity: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_UNIVERSITY: {
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_UNIVERSITY), 1);
      return {
        ...state,
        selectedUniversity: action.payload,
        actionsQueue: [...tempActions]
      }
    }
    case HomeActions.LOAD_UNIVERSITY_MAJOR_DETAIL:
      return {
        ...state,
        cusMajorDetailPageFilter: action.payload.pageFilter,
        majorDetailFilter: action.payload.queryFilter,
        cusMajorDetailPageResponse: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_UNIVERSITY_MAJOR_DETAIL:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_UNIVERSITY_MAJOR_DETAIL), 1);
      return {
        ...state,
        cusMajorDetailPageResponse: action.payload,
        actionsQueue: [...tempActions]
      }
    case HomeActions.LOAD_SEASONS:
      return {
        ...state,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_SEASONS:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_SEASONS), 1);
        return {
          ...state,
          seasons: action.payload,
          actionsQueue: [...tempActions]
        }
    case HomeActions.LOAD_MAJORS:
      return {
        ...state,
        cusMajorPageParam: action.payload.pageParam,
        cusMajorFilter:  action.payload.queryParam,
        cusMajorPageResponse: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_MAJORS:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_MAJORS), 1);
      return {
        ...state,
        cusMajorPageResponse: action.payload,
        actionsQueue: [...tempActions]
      }
    case HomeActions.LOAD_MAJOR:
      return {
        ...state,
        selectedMajorId: action.payload,
        cusMajorDetail: null,
        actionsQueue: [...state.actionsQueue, action],
      }
    case HomeActions.SET_MAJOR:
      tempActions.splice( tempActions.findIndex(a => a.type == HomeActions.LOAD_MAJOR), 1);
      return {
        ...state,
        cusMajorDetail: action.payload,
        actionsQueue: [...tempActions]
      }
    case HomeActions.HAS_ERRORS:
      tempActions.splice(tempActions.findIndex(a => a.type == action.payload.action), 1);
      return {
        ...state,
        errors: action.payload.messages,
        actionsQueue: [...tempActions]
      };
    case HomeActions.CONFIRM_ERRORS:
      return {
        ...state,
        errors: null,
      };  
    case HomeActions.RESET_STATE:
      return {
        ...state,
        testSubmissionParam: null,
        testSubmissionReponse: null,
        collapseTestsPageResponse: null,
        selectedTest: null
      };  
    default:
      return state;
  }
}