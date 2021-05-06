import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { CollapseArticle } from "src/app/_models/collapse-article";
import { DetailArticle } from "src/app/_models/detail-article";
import { PagedResponse } from "src/app/_models/paged-response";
import { Response } from "src/app/_models/response";
import { environment } from "src/environments/environment";
import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../store/home.actions';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  @Effect()
  loadCollapseArticles = this.actions$.pipe(
    ofType(HomeActions.LOAD_COLLAPSE_ARTICLES),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState] : [HomeActions.LoadCollapseArticles, {}]) => {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('pageNumber', actionData.payload.pageNumber.toString());
      queryParams = queryParams.append('pageSize', actionData.payload.pageSize.toString());
      return this.http.get<PagedResponse<CollapseArticle[]>>(environment.apiUrl + 'api/v1/article/all',
        {
          params: queryParams
        }
      ).pipe(
        map((collapseArticles) => {
          if (collapseArticles.succeeded) {
            return new HomeActions.SetCollapseArticles(collapseArticles);
          }
          return new HomeActions.HasErrors(collapseArticles.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );


  @Effect()
  loadDetailArticle = this.actions$.pipe(
    ofType(HomeActions.LOAD_DETAIL_ARTICLE),
    withLatestFrom(this.store.select('home')),
    switchMap(([actionData, homeState]) => {
      return this.http.get<Response<DetailArticle>>(environment.apiUrl + 'api/v1/article/detail/' + homeState.selectedArticleId
      ).pipe(
        map((response) => {
          if (response.succeeded) {
            return new HomeActions.SetDetailArticle(response.data);
          }
          return new HomeActions.HasErrors(response.errors);
        }),
        catchError((error) => {
          return of(new HomeActions.HasErrors([error.message]));
        })
      );
    }),
  );
}