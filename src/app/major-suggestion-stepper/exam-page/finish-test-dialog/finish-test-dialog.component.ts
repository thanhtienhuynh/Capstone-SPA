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
  marks: Mark[];
  testMarks: Mark[];
  doneTestIds: number[] = [];
  subjects: Subject[] = [];
  testSubmissionReponse: TestSubmission;
  selectedSubjectGroup: SuggestedSubjectsGroup;
  unsaveTestSubmissions: UnsaveTestSubmission[];
  user: User;
  displayedColumns =
      ['mon', 'hocba', 'thithu', 'tinhtoan'];
  dataSource = [];

  stepperSubscription: Subscription;
  authSubscription: Subscription;
  isSaving = false;
  isSaved = false;

  constructor(public dialogRef: MatDialogRef<FinishTestDialogComponent>,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.stepperSubscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.tests = stepperState.tests;
          this.doneTestIds = stepperState.doneTestIds;
          this.subjects = stepperState.subjects;
          this.testSubmissionReponse = stepperState.testSubmissionReponse;
          this.test = stepperState.test;
          this.marks = stepperState.marks;
          this.testMarks = stepperState.testMarks;
          this.suggestedSubjectsGroup = stepperState.suggestedSubjectsGroup;
          this.selectedSubjectGroup = stepperState.selectedSubjectGroup;
          this.unsaveTestSubmissions = stepperState.unsaveTestSubmissions;
          this.isSaved = stepperState.isSubmissionSaved;
          if (this.tests) {
            this.tests.forEach(e => {
              let tinhtoanMark;
              if (this.testMarks.filter(s => s.subjectId == e.subjectId)[0]?.mark >= 0) {
                tinhtoanMark = this.testMarks.filter(s => s.subjectId == e.subjectId)[0]?.mark;
              } else {
                tinhtoanMark = this.marks.filter(s => s.subjectId == e.subjectId)[0]?.mark ?? 'Chưa có';
              }
              this.dataSource.push({name: this.getSubjectName(e.subjectId), hocbaMark: this.marks.filter(s => s.subjectId == e.subjectId)[0]?.mark ?? 'Chưa có',
                                    thithuMark: this.testMarks.filter(s => s.subjectId == e.subjectId)[0]?.mark ?? 'Chưa thi', tinhtoanMark: tinhtoanMark});
            });
          }
        },
        (error) => {
        }
      );
    this.authSubscription = this.store
      .select('auth')
      .subscribe(
        (authState) => {
          this.user = authState.user;
          if (this.user && this.isSaving) {
            this.onSave();
          }
        },
        (error) => {
        }
      );
  }

  getListSubjectNameOfDoneTest() {
    let name = "";
    this.tests.forEach(element => {
      if (this.doneTestIds.includes(element.tests[0].id)) {
        name += name.length == 0 ? this.getSubjectName(element.subjectId) : ', ' + this.getSubjectName(element.subjectId);
      }
    });
    return name;
  }

  getSubjectName(id: number) {
    let subjectName;
    let subject = this.subjects.find(s => s.id === id);
    if (subject != null) {
      subjectName = subject.name;
    }
    return subjectName;
  }

  loadTest(id: number) {
    this.store.dispatch(new StepperActions.RefreshTest());
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

  onSave() {
    this.store.dispatch(new StepperActions.SaveUnsaveTestSubmissions());
    this.isSaving = true;
  }

  onLogin() {
    this.store.dispatch(new AuthActions.LoginGoogle());
    this.isSaving = true;
  }
}
