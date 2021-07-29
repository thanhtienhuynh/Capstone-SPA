import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "../_store/app.reducer";
import * as HomeActions from "../home/store/home.actions";
import { Observable, of } from "rxjs";
import { CusSingleMajorDetail } from "../_models/major";

@Injectable({ providedIn: "root" })
export class DetailMajorResolver implements Resolve<CusSingleMajorDetail> {
  constructor(private store: Store<fromApp.AppState>) {}
  resolve(route: ActivatedRouteSnapshot) : Observable<CusSingleMajorDetail>  {
    if (route.data) {
      this.store.dispatch(new HomeActions.LoadMajor(route.params['id']));
    }
    return  of(null);
  }
}