import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '../_models/user';
import { MessagingService } from '../_services/messaging.service';
import * as fromApp from '../_store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  subscription: Subscription;
  stepperSubscription: Subscription;
  user: User;
  errors: string[];
  message;
  isDoingTest: boolean = false;
  shouldLogout: boolean = false;
  constructor(private store: Store<fromApp.AppState>, private messagingService: MessagingService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
     
      if (this.user != authState.user) {
        this.user = authState.user;
        if (this.user) {
          this.messagingService.requestPermission(this.user.id.toString());
          this.messagingService.receiveMessage();
          this.message = this.messagingService.currentMessage;
        }
      }
      if (this.shouldLogout != authState.shoudLogout) {
        this.shouldLogout = authState.shoudLogout;
      }
      this.errors = authState.errors;
      if (this.errors) {
        Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
        .then(() => {
          this.store.dispatch(new AuthActions.ConfirmErrors());
        });
      }
    });

    this.stepperSubscription = this.store.select('stepper').subscribe((stepperState) => {
      if (this.isDoingTest != stepperState.isDoingTest) {
        this.isDoingTest = stepperState.isDoingTest;
        if (!this.isDoingTest && this.shouldLogout) {
          this.store.dispatch(new AuthActions.Logout());
        }
      }
    });
  }
  
  onGoogleLoginClick() {
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

  onLogout() {
    if (this.isDoingTest) {
      this.store.dispatch(new AuthActions.ShouldLogout(true));
    } else {
      this.store.dispatch(new AuthActions.Logout());
    }
  }
}
