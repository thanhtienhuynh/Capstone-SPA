import { CollapseArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { PagedResponse } from "src/app/_models/paged-response";
import * as HomeActions from '../store/home.actions';

export interface State {
  collapseArticlesPageResponse: PagedResponse<CollapseArticle[]>;
  isLoading: boolean;
  selectedArticleId: number;
  detailSelectedArticle: DetailArticle;
  errors: string[];
}

const initialState: State = {
  collapseArticlesPageResponse: null,
  isLoading: false,
  selectedArticleId: null,
  detailSelectedArticle: null,
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
    default:
      return state;
  }
}