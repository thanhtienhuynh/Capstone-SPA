import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import * as fromApp from '../_store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  subscription: Subscription;
  user: User;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
    });
  }
  
  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
