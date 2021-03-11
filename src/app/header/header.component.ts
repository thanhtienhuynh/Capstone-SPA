import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../_store/app.reducer';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import * as AuthActions from '../authentication/store/auth.actions';
import { User } from '../_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>, private angularAuth: AngularFireAuth) { }

  subscription: Subscription;
  user: User;

  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      if(authState.user) {
        this.user = authState.user;
      }
    });
    // this.angularAuth.authState.subscribe((firebaseUser: firebase.User) => {
    //   if (firebaseUser) {
    //    firebaseUser.getIdToken().then((token) => {
    //       console.log(token);
    //     });
    //   }
    // });
  }

  onGoogleLoginClick() {
    // var googleProvider = new firebase.auth.GoogleAuthProvider();
    // googleProvider.addScope('email');
    // googleProvider.addScope('profile');
    // return this.angularAuth.signInWithPopup(googleProvider);
    this.store.dispatch(new AuthActions.LoginGoogle());
  }

}
