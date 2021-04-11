import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../_store/app.reducer';
import * as UserActions from '../user/store/user.actions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor( private store: Store<fromApp.AppState>) { }
  subscription: Subscription;

  ngOnInit() {
    
  }

  onSubmissionsClick() {
    this.store.dispatch(new UserActions.LoadSubmissions());
  }
}
