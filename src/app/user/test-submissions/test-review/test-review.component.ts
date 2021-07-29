import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserDetailTestSubmission } from 'src/app/_models/user-test-submission';
import Swal from 'sweetalert2';
import * as fromApp from '../../../_store/app.reducer';
import * as UserActions from '../../store/user.actions';

@Component({
  selector: 'app-test-review',
  templateUrl: './test-review.component.html',
  styleUrls: ['./test-review.component.scss']
})
export class TestReviewComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  detailTestSubmission: UserDetailTestSubmission;
  errors: string[];
  userActionQueue: UserActions.UserActions[] = [];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.detailTestSubmission = userState.detailTestSubmission;
          this.errors = userState.errors;
          this.userActionQueue = userState.actionsQueue;
          if (this.errors) {
            Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
              this.store.dispatch(new UserActions.ConfirmErrors());
            });
          }
        },
        (error) => {
        }
    );
  }

  getRealOrder(realOrder: number) {
    if (this.detailTestSubmission != null && this.detailTestSubmission.questionSubmissions.length > 0) {
      let question = this.detailTestSubmission.questionSubmissions.find(q => q.realOrder == realOrder);
      if (question != null && question.result.indexOf('1') >= 0) {
        return question.realOrder;
      }
    }
    return -1;
  }

  isRight(realOrder: number) {
    if (this.detailTestSubmission != null && this.detailTestSubmission.questionSubmissions.length > 0) {
      let question = this.detailTestSubmission.questionSubmissions.find(q => q.realOrder == realOrder);
      if (question != null) {
        if (question.result.indexOf('1') >= 0 && question.result.indexOf('1') == question.rightResult.indexOf('1')) {
          return true;
        }
      }
    }
    return false;
  }

  isWrong(realOrder: number) {
    if (this.detailTestSubmission != null && this.detailTestSubmission.questionSubmissions.length > 0) {
      let question = this.detailTestSubmission.questionSubmissions.find(q => q.realOrder == realOrder);
      if (question != null) {
        if (question.result.indexOf('1') >= 0 && question.result.indexOf('1') != question.rightResult.indexOf('1')) {
          return true;
        }
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.store.dispatch(new UserActions.SetDetailSubmission(null));
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
