import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
// import * as fromApp from '../_store/app.reducer';
// import * as AuthActions from './store/auth.actions';
import * as fromApp from '../../../../../_store/app.reducer';
import * as AuthActions from '../../../../../authentication/store/auth.actions';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {
  subscription: Subscription;
  user: User;
  constructor(private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;        
    });
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
