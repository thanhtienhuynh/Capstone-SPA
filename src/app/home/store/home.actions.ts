import { Action } from "@ngrx/store";
import { CollapseArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { PagedResponse } from "src/app/_models/paged-response";
import { PageParam } from "src/app/_params/page-param";

export const LOAD_COLLAPSE_ARTICLES = '[Home] Load Collapse Articles';
export const SET_COLLAPSE_ARTICLES = '[Home] Set Collapse Articles';
export const LOAD_DETAIL_ARTICLE = '[Home] Load Detail Article';
export const SET_DETAIL_ARTICLE = '[Home] Set Detail Article';
export const LOAD_TOP_ARTICLES = '[Home] Load Top Articles';
export const SET_TOP_ARTICLES = '[Home] Set Top Articles';
export const HAS_ERRORS = '[Home] Has Errors';
export const CONFIRM_ERRORS = '[Home] Confirm Errors';

export class LoadCollapseArticles implements Action {
  readonly type = LOAD_COLLAPSE_ARTICLES;
  constructor(public payload: PageParam) {};
}

export class SetCollapseArticles implements Action {
  readonly type = SET_COLLAPSE_ARTICLES;
  constructor(public payload: PagedResponse<CollapseArticle[]>) {};
}

export class LoadDetailArticle implements Action {
  readonly type = LOAD_DETAIL_ARTICLE;
  constructor(public payload: number) {};
}

export class SetDetailArticle implements Action {
  readonly type = SET_DETAIL_ARTICLE;
  constructor(public payload: DetailArticle) {};
}

export class LoadTopArticles implements Action {
  readonly type = LOAD_TOP_ARTICLES;
}

export class SetTopArticles implements Action {
  readonly type = SET_TOP_ARTICLES;
  constructor(public payload: CollapseArticle[]) {};
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export type HomeActions = LoadCollapseArticles | SetCollapseArticles | LoadDetailArticle | SetDetailArticle | HasErrors | ConfirmErrors
                        | LoadTopArticles | SetTopArticles;