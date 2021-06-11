import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/_models/test';
import * as fromApp from "../../_store/app.reducer";
import * as StepperActions from "../stepper/store/stepper.actions";
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { TestSubmission } from 'src/app/_models/test-submission';
import { User } from 'src/app/_models/user';
import { QuestionParam, TestSubmissionParam } from 'src/app/_params/question-param';
import { DEFAULT_UNSELECTED_ANSWER, DEFAULT_SELECTED_ANSWER } from '../../_common/constants';
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { SubmitDialogComponent } from './submit-dialog/submit-dialog.component';
import Swal from 'sweetalert2';
import { FinishTestDialogComponent } from './finish-test-dialog/finish-test-dialog.component';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.scss'],
})
export class ExamPageComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  @Output() isReloadUni = new EventEmitter<boolean>();

  examSubmissionFormGroup: FormGroup = null;

  test: Test;
  testSubmissionReponse: TestSubmission;
  isScored: boolean = false;
  user: User = null;
  isSaving = false;
  tests: ClassifiedTests[];
  doneTestIds: number[] = [];

  stepperSubscription: Subscription;
  authSubscription: Subscription;

  selectedIndex: any;
  selectedTestId: number;
  errors: string[];
  isSaved: boolean = false;

  constructor(private store: Store<fromApp.AppState>,  private _formBuilder: FormBuilder, 
              public dialog: MatDialog, public submitDialog: MatDialog, public finishTestDialog: MatDialog) { }

  ngOnInit() {    
    this.examSubmissionFormGroup = this._formBuilder.group({}); 

    this.stepperSubscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.selectedTestId = stepperState.selectedTestId;
          this.tests = stepperState.tests;
          this.doneTestIds = stepperState.doneTestIds;
          if (this.testSubmissionReponse != stepperState.testSubmissionReponse) {
            this.testSubmissionReponse = stepperState.testSubmissionReponse;
            this.isScored = true;
            if (this.testSubmissionReponse) {
              this.openFinishTestDialog();
            }
          }
          this.isSaved = stepperState.isSubmissionSaved;
          if (this.isSaved && this.isSaving) {
            this.openResultDialog();
            this.isSaving = false;
          }
          this.test = stepperState.test;
          if (this.test) {
            this.selectedIndex = null;
            for (let question of this.test.questions) {
              this.examSubmissionFormGroup.addControl(
                question.id.toString(),
                new FormControl(-1, null)
              );
              this.examSubmissionFormGroup.controls[question.id.toString()].valueChanges.subscribe(
                v => {
                  this.getOrderOfQuestion(question.realOrder);
                }
              )
            }
          } else {
            this.isSaving = false;
            this.isSaved = false;
            this.isScored  = false;
            this.examSubmissionFormGroup = this._formBuilder.group({}); 
          }
          this.errors = stepperState.errors;
          if (this.errors) {
            Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
              this.store.dispatch(new StepperActions.ConfirmErrors());
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
          if (this.isSaving && this.user) {
            this.dialog.closeAll();
            this.store.dispatch(new StepperActions.SaveUnsaveTestSubmissions());
          }
        },
        (error) => {
        }
    );

    
  }

  ngOnDestroy() {
    if (this.stepperSubscription) {
      this.stepperSubscription.unsubscribe();
    }
  }

  reSuggestUni() {
    this.isReloadUni.emit(true);
  }

  getOrderOfQuestion(index: number): void {
    this.selectedIndex = index;
  }

  onSubmit() {
    let questions: QuestionParam[] = [];
    for(let question of this.test.questions) {
      if (!question.isAnnotate) {
        questions.push(new QuestionParam(question.id, 
          this.getResult(question.options.length, +this.examSubmissionFormGroup.value[question.id])))
      }
    }
    // if (questions.filter(q => q.options.indexOf(DEFAULT_SELECTED_ANSWER) >= 0).length >= this.test.numberOfQuestion / 2) {
    if (questions.filter(q => q.options.indexOf(DEFAULT_SELECTED_ANSWER) >= 0).length >= 0) {
      this.countdown.stop();
      this.store.dispatch(new StepperActions.ScoringTest(
        new TestSubmissionParam(this.test.id, Math.ceil(this.test.timeLimit - (this.countdown.left / 60000)), questions)));
    } else {
      this.openSubmitDialog();
    }
    
  }

  getResult(numberOfAnswer: number, selectedId: number): string {
    let result = DEFAULT_UNSELECTED_ANSWER.repeat(numberOfAnswer);
    let finalResul = result;
    if (selectedId >= 0) {
      finalResul = result.substring(0, selectedId) + DEFAULT_SELECTED_ANSWER + result.substring(selectedId + 1);
    }
    return finalResul;
  }

  openResultDialog(): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      height: '210px',
      disableClose: false
    });
  }

  openSubmitDialog(): void {
    const dialogRef = this.submitDialog.open(SubmitDialogComponent, {
      width: '500px',
      height: '150px',
      disableClose: true
    });
  }

  openFinishTestDialog(): void {
    const dialogRef = this.finishTestDialog.open(FinishTestDialogComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: false
    });
  }

  handleCoundown(event: CountdownEvent) {
   if (event.action === "done") {
    this.onSubmit();
   }
  }

  onDoMoreClick() {
    this.openFinishTestDialog();
  }

  onSave() {
    if (this.user) {
      this.store.dispatch(new StepperActions.SaveUnsaveTestSubmissions());
      this.isSaving = true;
    } else {
      this.isSaving = true;
      this.openResultDialog();
    }
  }

}
