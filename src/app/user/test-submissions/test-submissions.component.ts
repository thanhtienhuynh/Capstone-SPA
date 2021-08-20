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
  isSuggestedTestControl: FormControl;
  constructor(private store: Store<fromApp.AppState>) { 
    this.form = new FormGroup({
    });
    this.subjectControl = new FormControl(0);
    this.form.addControl(
      'subject-select', this.subjectControl
    );
    this.isSuggestedTestControl = new FormControl(0);
    this.form.addControl(
      'is-suggested-test', this.isSuggestedTestControl
    );

    this.subjectControl.valueChanges.subscribe(() => {
      this.onSubmit();
    }); {
      
    }
    this.isSuggestedTestControl.valueChanges.subscribe(() => {
      this.onSubmit();
    });
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
    let isSuggest = null;
    let isSuggestValue = this.isSuggestedTestControl.value;
    if (isSuggestValue == "1") {
      isSuggest = true;
    } else if (isSuggestValue == "2") {
      isSuggest = false;
    }
    console.log(isSuggest);
    this.store.dispatch(new UserActions.LoadSubmissions({isSuggestedTest: isSuggest, order: 1, subjectId: this.subjectControl.value, testTypeId: null}));
  }

  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
