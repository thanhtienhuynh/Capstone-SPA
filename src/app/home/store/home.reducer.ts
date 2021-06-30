import { CollapseArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { PagedResponse } from "src/app/_models/paged-response";
import { Test } from "src/app/_models/test";
import { TestSubmission } from "src/app/_models/test-submission";
import { CusUniversity, CusUniversityMajorDetail, MajorDetailFilter, UniSeason } from "src/app/_models/university";
import { PageParam } from "src/app/_params/page-param";
import { TestSubmissionParam } from "src/app/_params/question-param";
import * as HomeActions from '../store/home.actions';

export interface State {
  collapseArticlesPageResponse: PagedResponse<CollapseArticle[]>;
  collapseTestsPageResponse: PagedResponse<Test[]>;
  topCollapseArticles: CollapseArticle[];
  isLoading: boolean;
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
  seasons: UniSeason[];
  errors: string[];
}

const initialState: State = {
  collapseArticlesPageResponse: null,
  isLoading: false,
  selectedArticleId: null,
  detailSelectedArticle: null,
  topCollapseArticles: [],
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
  seasons: [],
  errors: null
};

export function homeReducer(
  state = initialState,
  action: HomeActions.HomeActions
) {
  switch (action.type) {
    case HomeActions.LOAD_COLLAPSE_ARTICLES:
      return {
        ...state,
        isLoading: true
      }
    case HomeActions.SET_COLLAPSE_ARTICLES:
      return {
        ...state,
        collapseArticlesPageResponse: action.payload,
        isLoading: false
      }
    case HomeActions.LOAD_DETAIL_ARTICLE:
      return {
        ...state,
        isLoading: true,
        selectedArticleId: action.payload
      }
    case HomeActions.SET_DETAIL_ARTICLE:
      return {
        ...state,
        detailSelectedArticle: action.payload,
        isLoading: false
      }  
    case HomeActions.LOAD_TOP_ARTICLES:
      return {
        ...state,
        isLoading: true
      }  
      case HomeActions.SET_TOP_ARTICLES:
      return {
        ...state,
        topCollapseArticles: action.payload,
        isLoading: false
      }
    case HomeActions.LOAD_COLLAPSE_TESTS:
      return {
        ...state,
        isLoading: true
      }
    case HomeActions.SET_COLLAPSE_TESTS:
      return {
        ...state,
        collapseTestsPageResponse: action.payload,
        isLoading: false
      }  
    case HomeActions.LOAD_DETAIL_TEST:
      return {
        ...state,
        selectedTestId: action.payload,
        isLoading: true,
      }
    case HomeActions.SET_DETAIL_TEST:
      return {
        ...state,
        selectedTest: action.payload,
        isLoading: false
      }
    case HomeActions.SCORING_TEST:
      return {
        ...state,
        testSubmissionParam: action.payload,
        isLoading: true,
      };
    case HomeActions.SET_TEST_MARK:
      return {
        ...state,
        testSubmissionReponse: action.payload,
        isLoading: false,
      };
    case HomeActions.LOAD_UNIVERSITIES:
      return {
        ...state,
        isLoading: true
      }
    case HomeActions.SET_UNIVERSITIES: {
      return {
        ...state,
        universitiesPageResponse: action.payload,
        isLoading: false
      }
    }
    case HomeActions.LOAD_UNIVERSITY:
      return {
        ...state,
        selectedUniversityId: action.payload,
        isLoading: true
      }
    case HomeActions.SET_UNIVERSITY: {
      return {
        ...state,
        selectedUniversity: action.payload,
        isLoading: false
      }
    }
    case HomeActions.LOAD_UNIVERSITY_MAJOR_DETAIL:
      return {
        ...state,
        cusMajorDetailPageFilter: action.payload.pageFilter,
        majorDetailFilter: action.payload.queryFilter,
        isLoading: true
      }
    case HomeActions.SET_UNIVERSITY_MAJOR_DETAIL:
      return {
        ...state,
        cusMajorDetailPageResponse: action.payload,
        isLoading: false
      }
    case HomeActions.LOAD_SEASONS:
      return {
        ...state,
        isLoading: true
      }
    case HomeActions.SET_SEASONS:
        return {
          ...state,
          seasons: action.payload,
          isLoading: false
        }
    case HomeActions.HAS_ERRORS:
      return {
        ...state,
        errors: action.payload,
        isLoading: false
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
        seasons: [],
      };  
    default:
      return state;
  }
}