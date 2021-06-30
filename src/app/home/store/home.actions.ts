import { Action } from "@ngrx/store";
import { CollapseArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { PagedResponse } from "src/app/_models/paged-response";
import { Test } from "src/app/_models/test";
import { TestSubmission } from "src/app/_models/test-submission";
import { CusUniversity, CusUniversityMajorDetail, MajorDetailFilter, UniSeason } from "src/app/_models/university";
import { PageParam } from "src/app/_params/page-param";
import { TestSubmissionParam } from "src/app/_params/question-param";

export const LOAD_COLLAPSE_ARTICLES = '[Home] Load Collapse Articles';
export const SET_COLLAPSE_ARTICLES = '[Home] Set Collapse Articles';
export const LOAD_DETAIL_ARTICLE = '[Home] Load Detail Article';
export const SET_DETAIL_ARTICLE = '[Home] Set Detail Article';
export const LOAD_TOP_ARTICLES = '[Home] Load Top Articles';
export const SET_TOP_ARTICLES = '[Home] Set Top Articles';
export const LOAD_COLLAPSE_TESTS = '[Home] Load Collapse Tests';
export const SET_COLLAPSE_TESTS = '[Home] Set Collapse Tests';
export const LOAD_DETAIL_TEST = '[Home] Load Detail Test';
export const SET_DETAIL_TEST = '[Home] Set Detail Test';
export const SCORING_TEST = '[Home] Scoring Test';
export const LOAD_UNIVERSITIES = '[Home] Load Universities';
export const SET_UNIVERSITIES = '[Home] Set Universities';
export const SET_TEST_MARK = '[Home] Set Test Mark';
export const LOAD_UNIVERSITY = '[Home] Load University';
export const SET_UNIVERSITY = '[Home] Set University';
export const LOAD_UNIVERSITY_MAJOR_DETAIL = '[Home] Load University Major Detail';
export const SET_UNIVERSITY_MAJOR_DETAIL = '[Home] Set University Major Detail';
export const LOAD_SEASONS = '[Home] Load Seasons';
export const SET_SEASONS = '[Home] Set Seasons';
export const HAS_ERRORS = '[Home] Has Errors';
export const CONFIRM_ERRORS = '[Home] Confirm Errors';
export const RESET_STATE = '[Home] Reset State';

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

export class LoadCollapseTests implements Action {
  readonly type = LOAD_COLLAPSE_TESTS;
  constructor(public payload: {pageParam: PageParam, subjectId: number, searchTerm: string}) {};
}

export class SetCollapseTests implements Action {
  readonly type = SET_COLLAPSE_TESTS;
  constructor(public payload: PagedResponse<Test[]>) {};
}

export class LoadDetailTest implements Action {
  readonly type = LOAD_DETAIL_TEST;
  constructor(public payload: number) {};
}

export class SetDetailTest implements Action {
  readonly type = SET_DETAIL_TEST;
  constructor(public payload: Test) {};
}

export class ScoringTest implements Action {
  readonly type = SCORING_TEST;
  constructor(public payload: TestSubmissionParam) {}
}

export class SetTestMark implements Action {
  readonly type = SET_TEST_MARK;
  constructor(public payload: TestSubmission) {}
}

export class LoadUniversities implements Action {
  readonly type = LOAD_UNIVERSITIES;
  constructor(public payload: {pageParam: PageParam, order: number, searchTerm: string}) {};
}

export class SetUniversities implements Action {
  readonly type = SET_UNIVERSITIES;
  constructor(public payload: PagedResponse<CusUniversity[]>) {}
}

export class LoadUniversity implements Action {
  readonly type = LOAD_UNIVERSITY;
  constructor(public payload: number) {};
}

export class SetUniversity implements Action {
  readonly type = SET_UNIVERSITY;
  constructor(public payload: CusUniversity) {}
}

export class LoadUniversityMajorDetail implements Action {
  readonly type = LOAD_UNIVERSITY_MAJOR_DETAIL;
  constructor(public payload: {pageFilter: PageParam, queryFilter: MajorDetailFilter}) {};
}

export class SetUniversityMajorDetail implements Action {
  readonly type = SET_UNIVERSITY_MAJOR_DETAIL;
  constructor(public payload: PagedResponse<CusUniversityMajorDetail[]>) {}
}

export class LoadSeasons implements Action {
  readonly type = LOAD_SEASONS;
}

export class SetSeasons implements Action {
  readonly type = SET_SEASONS;
  constructor(public payload: UniSeason[]) {}
}

export class HasErrors implements Action {
  readonly type = HAS_ERRORS;
  constructor(public payload: string[]) {}
}

export class ConfirmErrors implements Action {
  readonly type = CONFIRM_ERRORS;
}

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export type HomeActions = LoadCollapseArticles | SetCollapseArticles | LoadDetailArticle | SetDetailArticle | HasErrors | ConfirmErrors
                        | LoadTopArticles | SetTopArticles | LoadCollapseTests | SetCollapseTests | LoadDetailTest | SetDetailTest
                        | LoadUniversities | SetUniversities| ScoringTest | SetTestMark | LoadUniversity | LoadUniversityMajorDetail
                        | SetUniversityMajorDetail | SetUniversity | SetSeasons | LoadSeasons | ResetState;