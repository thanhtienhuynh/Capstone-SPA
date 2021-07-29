import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Subject } from 'src/app/_models/subject';
import { Test } from 'src/app/_models/test';
import { TestSubmission } from 'src/app/_models/test-submission';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import * as fromApp from "../../../_store/app.reducer";
import * as StepperActions from "../../stepper/store/stepper.actions";
import * as AuthActions from "../../../authentication/store/auth.actions";
import { Mark } from 'src/app/_models/mark';
import { UnsaveTestSubmission } from 'src/app/_params/question-param';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-finish-test-dialog',
  templateUrl: './finish-test-dialog.component.html',
  styleUrls: ['./finish-test-dialog.component.scss']
})
export class FinishTestDialogComponent implements OnInit, OnDestroy {

  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  tests: ClassifiedTests[];
  test: Test;
  needDoneTestIds: number[] = [];
  subjects: Subject[] = [];
  testSubmissionReponse: TestSubmission;
  selectedSubjectGroup: SuggestedSubjectsGroup;

  stepperSubscription: Subscription;
  authSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<FinishTestDialogComponent>,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.stepperSubscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.tests = stepperState.tests;
          this.needDoneTestIds = stepperState.needDoneTestIds;
          this.subjects = stepperState.subjects;
          this.testSubmissionReponse = stepperState.testSubmissionReponse;
          this.test = stepperState.test;
          this.suggestedSubjectsGroup = stepperState.suggestedSubjectsGroup;
          this.selectedSubjectGroup = stepperState.selectedSubjectGroup;
        },
        (error) => {
        }
      );
  }

  getSubjectName(id: number) {
    let subjectName;
    let subject = this.subjects.find(s => s.id === id);
    if (subject != null) {
      subjectName = subject.name;
    }
    return subjectName;
  }

  reloadSuggest() {
    this.dialogRef.close(true);
  }

  loadTest(id: number) {
    this.store.dispatch(new StepperActions.LoadTest(id));
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.stepperSubscription) {
      this.stepperSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
