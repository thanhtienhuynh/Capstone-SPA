import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TestSubmission } from 'src/app/_models/test-submission';
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

  isLoggedIn: boolean = false;

  onOkClick(): void {
    this.dialogRef.close();
  }

  onLoginClick(): void {
    this.isLoggedIn = true;
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
