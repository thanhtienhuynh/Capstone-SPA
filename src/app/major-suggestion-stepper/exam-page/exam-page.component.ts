import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.scss'],
})
export class ExamPageComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;


  examSubmissionFormGroup: FormGroup = null;
  test: Test;
  testSubmissionReponse: TestSubmission;
  isScored: boolean = false;
  user: User = null;
  isSaving = false;

  stepperSubscription: Subscription;
  authSubscription: Subscription;

  selectedIndex: any;
  selectedTestId: number;
  isSaved: boolean = false;

  constructor(private store: Store<fromApp.AppState>,  private _formBuilder: FormBuilder, 
              public dialog: MatDialog, public submitDialog: MatDialog) { }

  ngOnInit() {    
    this.examSubmissionFormGroup = this._formBuilder.group({}); 

    this.stepperSubscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {

          this.testSubmissionReponse = stepperState.testSubmissionReponse;
          
          this.selectedTestId = stepperState.selectedTestId;
          if (this.testSubmissionReponse) {
            this.isScored = true;
          }
          this.isSaved = stepperState.isSaved;
          if (this.isSaved) {
            this.openDialog();
            console.log('run 1 ne');
          }
          this.test = stepperState.test;
          if (this.test) {
            for (let question of this.test.questions) {
              this.examSubmissionFormGroup.addControl(
                question.id.toString(),
                new FormControl(-1, null)
              );
            }
          }
           else {
            console.log('vao ne');
            this.isSaving = false;
            this.isSaved = false;
            this.isScored  = false;
          }
        },
        (error) => {
          console.log(error);
        }
    );

    this.authSubscription = this.store
      .select('auth')
      .subscribe(
        (authState) => {
          this.user = authState.user;
          if (this.isSaving && this.user) {
            this.dialog.closeAll();
            this.store.dispatch(new StepperActions.SaveTestSubmission());
            this.isSaving = false;
          }
        },
        (error) => {
          console.log(error);
        }
    );

    
  }

  ngOnDestroy() {
    if (this.stepperSubscription) {
      this.stepperSubscription.unsubscribe();
    }
  }

  getOrderOfQuestion(index: number): void {
    this.selectedIndex = index;
  }

  onSubmit() {
    let questions: QuestionParam[] = [];
    for(let question of this.test.questions) {
      questions.push(new QuestionParam(question.id, 
        this.getResult(question.options.length, +this.examSubmissionFormGroup.value[question.id])))
    }
    // if (questions.filter(q => q.options.indexOf(DEFAULT_SELECTED_ANSWER) >= 0).length >= this.test.numberOfQuestion / 2) {
    if (questions.filter(q => q.options.indexOf(DEFAULT_SELECTED_ANSWER) >= 0).length >= 0) {
      this.countdown.stop();
      this.store.dispatch(new StepperActions.ScoringTest(
        new TestSubmissionParam(this.test.id, Math.ceil(90 - (this.countdown.left / 60000)), questions)));
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

  openDialog(): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      height: '210px',
      disableClose: true
    });
  }

  openSubmitDialog(): void {
    const dialogRef = this.submitDialog.open(SubmitDialogComponent, {
      width: '500px',
      height: '150px',
      disableClose: true
    });
  }

  handleCoundown(event: CountdownEvent) {
   if (event.action === "done") {
    this.onSubmit();
   }
  }

  onSave() {
    if (this.user) {
      this.store.dispatch(new StepperActions.SaveTestSubmission());
    } else {
      this.isSaving = true;
      this.openDialog();
      console.log('Run 2 ne');
    }
  }

}
