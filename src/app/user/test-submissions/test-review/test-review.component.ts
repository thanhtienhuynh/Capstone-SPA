import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserDetailTestSubmission } from 'src/app/_models/user-test-submission';
import * as fromApp from '../../../_store/app.reducer';

@Component({
  selector: 'app-test-review',
  templateUrl: './test-review.component.html',
  styleUrls: ['./test-review.component.scss']
})
export class TestReviewComponent implements OnInit {

  subscription: Subscription;
  detailTestSubmission: UserDetailTestSubmission;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.detailTestSubmission = userState.detailTestSubmission;
        },
        (error) => {
        }
    );
  }

}
