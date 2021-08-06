import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user'
import * as fromApp from "./../../_store/app.reducer";
import * as AuthActions from '../../authentication/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-mock-test-rules-dialog',
  templateUrl: './mock-test-rules-dialog.component.html',
  styleUrls: ['./mock-test-rules-dialog.component.scss']
})
export class MockTestRulesDialogComponent implements OnInit {

  subscription: Subscription;
  user: User;

  constructor(public dialogRef: MatDialogRef<MockTestRulesDialogComponent>, private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
      // if (this.user) {
      //   this.dialogRef.close();
      // }
    });
  }

  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  doTest() {
    this.dialogRef.close(true);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
