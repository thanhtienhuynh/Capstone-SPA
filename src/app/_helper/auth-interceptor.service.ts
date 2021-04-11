import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, take } from "rxjs/operators";
import * as fromApp from '../_store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor( private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.token;
      }),
      exhaustMap(token => {
        if (!token) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: req.headers.append('Authorization', 'Bearer ' + token)
        });
        return next.handle(modifiedReq);
      })
    );
  }
}