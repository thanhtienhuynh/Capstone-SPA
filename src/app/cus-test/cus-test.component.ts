import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../_store/app.reducer';
import * as HomeActions from '../home/store/home.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cus-test',
  templateUrl: './cus-test.component.html',
  styleUrls: ['./cus-test.component.scss']
})
export class CusTestComponent implements OnInit, OnDestroy {

  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  isLoading: boolean;

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
