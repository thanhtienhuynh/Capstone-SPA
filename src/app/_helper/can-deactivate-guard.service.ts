import { Component, HostListener, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CusTestDetailComponent } from "../cus-test/cus-test-detail/cus-test-detail.component";

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot,
            currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot)
  : Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}

@Injectable()
export abstract class CanComponentDeactivate {
  abstract canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   if (this.canDeactivate()) {
  //     $event.returnValue = true;
  //   }
  // }
}

