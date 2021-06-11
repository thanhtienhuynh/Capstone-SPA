import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { DetailArticle } from "../_models/detail-article";
import * as fromApp from "../_store/app.reducer";
import * as HomeActions from "../home/store/home.actions";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class DetailArticleResolver implements Resolve<DetailArticle> {
  constructor(private store: Store<fromApp.AppState>) {}
  resolve(route: ActivatedRouteSnapshot) : Observable<DetailArticle>  {
    if (route.data) {
      this.store.dispatch(new HomeActions.LoadDetailArticle(route.params['id']));
    }
    return  of(null);
  }
}