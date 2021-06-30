import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestSubjectGuard implements CanActivate {
  subjects = ['math', 'english', 'physics', 'chemistry', 'biography', 'geography', 'history', 'civic-education'];
  constructor(
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    let subject = route.params['subject-name'];
    if (this.subjects.find(s => s == subject)) {
     return true;
    } else {
      return false;
    }
  }
}
