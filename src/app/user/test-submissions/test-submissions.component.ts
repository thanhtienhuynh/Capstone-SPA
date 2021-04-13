import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';
import { UserTestSubmission } from '../../_models/user-test-submission';

@Component({
  selector: 'app-test-submissions',
  templateUrl: './test-submissions.component.html',
  styleUrls: ['./test-submissions.component.scss']
})
export class TestSubmissionsComponent implements OnInit {
  dateStart = new FormControl(new Date((new Date().getTime() - 3888000000)))
  dateEnd = new FormControl(new Date())
  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription;
  testSubmissions: UserTestSubmission[];

  ngOnInit() {
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.testSubmissions = userState.testSubmissions;
        },
        (error) => {
        }
    );
  }

  testReviewClick(id: number) {
    this.store.dispatch(new UserActions.LoadDetailSubmission(id));
  }

}
