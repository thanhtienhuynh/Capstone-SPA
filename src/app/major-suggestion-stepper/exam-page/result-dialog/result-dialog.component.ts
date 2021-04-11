import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import * as fromApp from '../../../_store/app.reducer';
import * as AuthActions from '../../../authentication/store/auth.actions';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  user: User;
  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>, private store: Store<fromApp.AppState>) {}


  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
    });
  }


  onOkClick(): void {
    this.dialogRef.close();
  }


  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
