import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
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
  errors: string[];
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
      this.errors = authState.errors;
      if (this.errors) {
        Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
        .then(() => {
          this.store.dispatch(new AuthActions.ConfirmErrors());
        });
      }
    });
  }
  
  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
