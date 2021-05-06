import { Component, OnInit } from '@angular/core';
import * as fromApp from "../../../_store/app.reducer";
import * as AuthActions from '../../../authentication/store/auth.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  subscription: Subscription;
  user: User;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
      if (this.user) {
        this.dialogRef.close();
      }
    });
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
