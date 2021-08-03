import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ɵɵNgOnChangesFeature } from '@angular/core';
import { Store } from '@ngrx/store';
import { Test } from 'src/app/_models/test';
import * as fromApp from "../../_store/app.reducer";
import * as StepperActions from "../stepper/store/stepper.actions";
import * as AuthActions from '../../authentication/store/auth.actions';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { TestSubmission } from 'src/app/_models/test-submission';
import { QuestionParam, TestSubmissionParam } from 'src/app/_params/question-param';
import { DEFAULT_UNSELECTED_ANSWER, DEFAULT_SELECTED_ANSWER } from '../../_common/constants';
import { MatDialog } from '@angular/material/dialog';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { SubmitDialogComponent } from './submit-dialog/submit-dialog.component';
import Swal from 'sweetalert2';
import { FinishTestDialogComponent } from './finish-test-dialog/finish-test-dialog.component';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.scss'],
})
export class ExamPageComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  @Output() isReloadUni = new EventEmitter<boolean>();
  @Input() isConfirmedOut: boolean;

  examSubmissionFormGroup: FormGroup = null;

  test: Test;
  testSubmissionReponse: TestSubmission;
  isScored: boolean = false;
  tests: ClassifiedTests[];
  needDoneTestIds: number[] = [];

  stepperSubscription: Subscription;
  authSubscription: Subscription;

  selectedIndex: any;
  selectedTestId: number;
  errors: string[];
  isSaved: boolean = false;
  isDoingTest: boolean = false;
  numberOfCompletedQuestion: number = 0;
  shoudLogout: boolean = false;

  constructor(private store: Store<fromApp.AppState>,  private _formBuilder: FormBuilder, 
              public dialog: MatDialog, public submitDialog: MatDialog, public finishTestDialog: MatDialog) {
  }

  ngOnInit() {    
    this.examSubmissionFormGroup = this._formBuilder.group({}); 
    this.stepperSubscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.selectedTestId = stepperState.selectedTestId;
          this.tests = stepperState.tests;
          this.needDoneTestIds = stepperState.needDoneTestIds;
          if (this.testSubmissionReponse != stepperState.testSubmissionReponse) {
            this.testSubmissionReponse = stepperState.testSubmissionReponse;
            if (this.testSubmissionReponse) {
              if (!this.shoudLogout) {
                this.openFinishTestDialog();
              }
              this.isScored = true;
            }
          }
          if (this.isDoingTest != stepperState.isDoingTest) {
            this.isDoingTest = stepperState.isDoingTest;
          }
          if (this.isSaved != stepperState.isSubmissionSaved) {
            this.isSaved = stepperState.isSubmissionSaved;
          }
          
          if (this.test !=  stepperState.test) {
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
                    this.calculateCompleted();
                  }
                )
              }
            } else {
              this.isScored = false;
              this.examSubmissionFormGroup = this._formBuilder.group({}); 
            }
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
        if (this.shoudLogout != authState.shoudLogout) {
          this.shoudLogout = authState.shoudLogout;
          if (this.shoudLogout) {
            if (this.isDoingTest) {
              Swal.fire({
                title: 'Bạn chưa hoàn thành bài thi!',
                text: "Chú ý: Nếu bạn thoát, hệ thống sẽ ghi nhận điểm của bạn đến thời điểm này?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Đăng xuất',
                cancelButtonText: 'Tiếp tục làm bài'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.onSubmit();
                } else {
                  this.store.dispatch(new AuthActions.ShouldLogout(false));
                }
              });
            } else {
              this.store.dispatch(new AuthActions.Logout());
            }
          }
        }
      },
      (error) => {
      }
    );
  }

  ngOnChanges() {
  }

  calculateCompleted() {
    let questions: QuestionParam[] = [];
    for(let question of this.test.questions) {
      if (!question.isAnnotate) {
        questions.push(new QuestionParam(question.id, 
          this.getResult(question.options.length, +this.examSubmissionFormGroup.controls[question.id.toString()].value)));
      }
    }
    this.numberOfCompletedQuestion = questions.filter(q => q.options.indexOf(DEFAULT_SELECTED_ANSWER) >= 0).length;
  }
  

  answerClick(quesId: number) {
    const itemToScrollTo = document.getElementById(quesId.toString());
    if (itemToScrollTo) {
      itemToScrollTo.scrollIntoView(true);
    }
  }

  ngOnDestroy() {
    if (this.isDoingTest) {
      this.onSubmit();
    }
    this.store.dispatch(new StepperActions.RefreshTest());
    if (this.stepperSubscription) {
      this.stepperSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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
          this.getResult(question.options.length, +this.examSubmissionFormGroup.controls[question.id.toString()].value)));
      }
    }
    this.countdown.stop();
    this.store.dispatch(new StepperActions.ScoringTest(
      new TestSubmissionParam(this.test.id, Math.ceil(this.test.timeLimit - (this.countdown.left / 60000)), questions)));
  }

  onSubmitClick() {
    this.openSubmitDialog(this.test.numberOfQuestion - this.numberOfCompletedQuestion, Math.floor(this.countdown.left / 60000));
  }

  getResult(numberOfAnswer: number, selectedId: number): string {
    let result = DEFAULT_UNSELECTED_ANSWER.repeat(numberOfAnswer);
    let finalResul = result;
    if (selectedId >= 0) {
      finalResul = result.substring(0, selectedId) + DEFAULT_SELECTED_ANSWER + result.substring(selectedId + 1);
    }
    return finalResul;
  }

  openSubmitDialog(questionRemaining: number, timeRemaining: number): void {
    let caution = "";
    if (questionRemaining > 0 && timeRemaining > 0) {
      caution = "<p style=\"color: red\">Chú ý: Bạn còn " + questionRemaining + " câu hỏi chưa làm và "  + timeRemaining + " phút để làm bài.</p>"
    } else if (questionRemaining > 0) {
      caution = "<p style=\"color: red\">Chú ý: Bạn còn " + questionRemaining + " câu hỏi chưa làm.</p>"
    } else if (timeRemaining > 0) {
      caution = "<p style=\"color: red\">Chú ý: Bạn còn " + timeRemaining + " phút để làm bài, kiểm tra kĩ trước khi nộp bài.</p>"
    }
    Swal.fire({
      title: 'Bạn có chắc muốn nộp bài thi?',
      html: caution,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Nộp bài',
      cancelButtonText: 'Tiếp tục làm bài'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });
  }

  openFinishTestDialog(): void {
    const dialogRef = this.finishTestDialog.open(FinishTestDialogComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(v => {
      if (v) {
        this.reSuggestUni();
      }
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

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isDoingTest) {
      $event.returnValue = true;
    }
  }

}
