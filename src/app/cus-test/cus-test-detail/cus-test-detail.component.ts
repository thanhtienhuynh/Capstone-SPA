import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../../home/store/home.actions';
import * as UserActions from '../../user/store/user.actions';
import { Observable, Subscription } from 'rxjs';
import { Test } from 'src/app/_models/test';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { QuestionParam, TestSubmissionParam } from 'src/app/_params/question-param';
import { DEFAULT_SELECTED_ANSWER, DEFAULT_UNSELECTED_ANSWER } from 'src/app/_common/constants';
import { TestSubmission } from 'src/app/_models/test-submission';
import Swal from 'sweetalert2';
import { CanComponentDeactivate } from 'src/app/_helper/can-deactivate-guard.service';
import { User } from 'src/app/_models/user';
import { ResultDialogComponent } from 'src/app/major-suggestion-stepper/exam-page/result-dialog/result-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-cus-test-detail',
  templateUrl: './cus-test-detail.component.html',
  styleUrls: ['./cus-test-detail.component.scss',]
})
export class CusTestDetailComponent extends CanComponentDeactivate implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  subscription: Subscription;
  userSubscription: Subscription;
  examSubmissionFormGroup: FormGroup = null;
  testSubmissionReponse: TestSubmission;
  test: Test;
  testId: number;
  homeActionQueue: HomeActions.HomeActions[] = [];
  selectedIndex: number;
  isScored: boolean;
  isSaved: boolean = false;
  isSaving: boolean = false;
  numberOfCompletedQuestion: number = 0;
  user: User;
  errors: string[];


  constructor(private store: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder,
    public dialog: MatDialog) {
    super();  
  }

  ngOnInit() {
    this.examSubmissionFormGroup = this._formBuilder.group({}); 
    this.testId = this.activatedRoute.snapshot.params['id'];
    this.store.dispatch(new HomeActions.LoadDetailTest(this.testId));
    this.subscription = this.store.select('home').subscribe(homeState => {
      this.homeActionQueue = homeState.actionsQueue;

      if (this.isSaved != homeState.isSubmissionSaved) {
        this.isSaved = homeState.isSubmissionSaved;
      }

      if (this.test != homeState.selectedTest) {
        this.test = homeState.selectedTest;
        if (this.test) {
          this.selectedIndex = null;
          for (let question of this.test.questions) {
            this.examSubmissionFormGroup.addControl(
              question.id.toString(),
              new FormControl(-1, null)
            );
            this.examSubmissionFormGroup.controls[question.id.toString()].valueChanges.subscribe(
              v => {
                this.selectedIndex = question.realOrder;
                this.calculateCompleted();
              }
            )
          }
        } else {
          this.isScored  = false;
          this.examSubmissionFormGroup = this._formBuilder.group({}); 
        }
      }

      if (this.testSubmissionReponse != homeState.testSubmissionReponse) {
        this.testSubmissionReponse = homeState.testSubmissionReponse;
        this.isScored = true;
        if (this.testSubmissionReponse) {
          // this.openFinishTestDialog();
        }
      }

      this.errors = this.errors;
      if (this.errors && this.errors.length > 0) {
        Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
          .then(() => {
            this.store.dispatch(new HomeActions.ConfirmErrors());
          });
      }
    });

    this.userSubscription = this.store
    .select('auth')
    .subscribe(
      (authState) => {
        this.user = authState.user;
      },
      (error) => {
      }
    );
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

  handleCoundown(event: CountdownEvent) {
    if (event.action === "done") {
     this.onSubmit();
    }
  }

  onSubmitClick() {
    this.openSubmitDialog(this.test.numberOfQuestion - this.numberOfCompletedQuestion, Math.floor(this.countdown.left / 60000));
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
    this.countdown.stop();
    this.store.dispatch(new HomeActions.ScoringTest(
      new TestSubmissionParam(this.test.id, Math.ceil(this.test.timeLimit - (this.countdown.left / 60000)), questions)));
    
  }

  
  getResult(numberOfAnswer: number, selectedId: number): string {
    let result = DEFAULT_UNSELECTED_ANSWER.repeat(numberOfAnswer);
    let finalResul = result;
    if (selectedId >= 0) {
      finalResul = result.substring(0, selectedId) + DEFAULT_SELECTED_ANSWER + result.substring(selectedId + 1);
    }
    return finalResul;
  }
  
  isRightAnswer(questionId: number, index: number) {
    if (this.testSubmissionReponse != null && this.testSubmissionReponse.resultQuestions != null && this.testSubmissionReponse.resultQuestions.length > 0) {
      let question = this.testSubmissionReponse.resultQuestions.find(q => q.id == questionId);
      if (question) {
        return question.result.trim().indexOf('1') == index;
      }
    }
    return false;
  }

  isWrongAnswer(questionId: number, index: number) {
    for(let question of this.test.questions) {
      if (!question.isAnnotate) {
        if (questionId == question.id) {
          let submitedIndex =  this.getResult(question.options.length, +this.examSubmissionFormGroup.value[questionId]).indexOf('1');
          if (submitedIndex >= 0 && submitedIndex == index) {
            if (this.testSubmissionReponse != null && this.testSubmissionReponse.resultQuestions != null && this.testSubmissionReponse.resultQuestions.length > 0) {
              let question = this.testSubmissionReponse.resultQuestions.find(q => q.id == questionId);
              if (question) {
                return question.result.trim().indexOf('1') != submitedIndex;
              }
            }
          }
        }
      }
    }
    return false;
  }

  onSave() {
    if (this.userSubscription) {
      this.store.dispatch(new HomeActions.SaveUnsaveTestSubmissions());
      this.isSaving = true;
    } else {
      this.isSaving = true;
      this.openResultDialog();
    }
  }

  openResultDialog(): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      height: '210px',
      disableClose: false
    });
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
    if (this.testSubmissionReponse) {
      return true;
    } else {
      return Swal.fire({
        title: 'Bạn chưa hoàn thành bài thi!',
        text: "Bạn có muốn tiếp tục làm bài?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Thoát',
        cancelButtonText: 'Tiếp tục'
      }).then((result) => {
        return result.isConfirmed;
      });
    } 
  }

  answerClick(quesId: number) {
    const itemToScrollTo = document.getElementById(quesId.toString());
    if (itemToScrollTo) {
      itemToScrollTo.scrollIntoView(true);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  ngOnDestroy() {
    this.store.dispatch(new HomeActions.ResetState());
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
