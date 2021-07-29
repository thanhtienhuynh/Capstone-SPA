import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../_store/app.reducer';
import * as UserActions from '../store/user.actions';
import { UserTestSubmission } from '../../_models/user-test-submission';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-submissions',
  templateUrl: './test-submissions.component.html',
  styleUrls: ['./test-submissions.component.scss']
})
export class TestSubmissionsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subjectControl: FormControl;
  testTypeControl: FormControl;
  isSuggestControl: FormControl;
  constructor(private store: Store<fromApp.AppState>) { 
    this.form = new FormGroup({
    });
    this.subjectControl = new FormControl(0);
    this.form.addControl(
      'subject-select', this.subjectControl
    );
    this.testTypeControl = new FormControl(0);
    this.form.addControl(
      'test-type', this.testTypeControl
    );
    this.isSuggestControl = new FormControl(0);
    this.form.addControl(
      'is-suggest-test', this.isSuggestControl
    );
  }
  subscription: Subscription;
  testSubmissions: UserTestSubmission[];
  errors: string[];
  userActionQueue: UserActions.UserActions[] = [];

  ngOnInit() {
    this.store.dispatch(new UserActions.LoadSubmissions({isSuggestedTest: null, order: 1, subjectId: null, testTypeId: null}));
    this.subscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          if (this.testSubmissions != userState.testSubmissions) {
            this.testSubmissions = userState.testSubmissions;
            if (this.testSubmissions != null && this.testSubmissions.length > 0) {
              
            }
          }
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

  testReviewClick(id: number) {
    this.store.dispatch(new UserActions.LoadDetailSubmission(id));
  }

  onSubmit() {
    console.log(this.subjectControl.value);
    console.log(this.testTypeControl.value);
    console.log(this.isSuggestControl.value);
    this.store.dispatch(new UserActions.LoadSubmissions({isSuggestedTest: this.isSuggestControl.value, order: 1, subjectId: this.subjectControl.value, testTypeId: this.testTypeControl.value}));
  }

  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
