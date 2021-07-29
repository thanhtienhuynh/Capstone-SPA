import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { DetailArticle } from "../_models/detail-article";
import * as fromApp from "../_store/app.reducer";
import * as HomeActions from "../home/store/home.actions";
import { Observable, of } from "rxjs";
import { CusUniversity } from "../_models/university";

@Injectable({ providedIn: "root" })
export class DetailUniversityResolver implements Resolve<CusUniversity> {
  constructor(private store: Store<fromApp.AppState>) {}
  resolve(route: ActivatedRouteSnapshot) : Observable<CusUniversity>  {
    if (route.data) {
      this.store.dispatch(new HomeActions.LoadUniversity(route.params['id']));
    }
    return  of(null);
  }
}