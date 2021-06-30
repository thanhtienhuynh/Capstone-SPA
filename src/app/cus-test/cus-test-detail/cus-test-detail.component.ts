import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../../home/store/home.actions';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/_models/test';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { QuestionParam, TestSubmissionParam } from 'src/app/_params/question-param';
import { DEFAULT_SELECTED_ANSWER, DEFAULT_UNSELECTED_ANSWER } from 'src/app/_common/constants';
import { TestSubmission } from 'src/app/_models/test-submission';
@Component({
  selector: 'app-cus-test-detail',
  templateUrl: './cus-test-detail.component.html',
  styleUrls: ['./cus-test-detail.component.scss',]
})
export class CusTestDetailComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  subscription: Subscription;
  examSubmissionFormGroup: FormGroup = null;
  testSubmissionReponse: TestSubmission;
  test: Test;
  testId: number;
  isLoading: boolean;
  selectedIndex: any;
  isScored: boolean;


  constructor(private store: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.examSubmissionFormGroup = this._formBuilder.group({}); 
    this.testId = this.activatedRoute.snapshot.params['id'];
    this.store.dispatch(new HomeActions.ResetState());
    this.store.dispatch(new HomeActions.LoadDetailTest(this.testId));
    this.subscription = this.store.select('home').subscribe(homeState => {
      this.isLoading = homeState.isLoading;
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
                this.getOrderOfQuestion(question.realOrder);
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
    });
  }

  getOrderOfQuestion(index: number): void {
    this.selectedIndex = index;
  }

  handleCoundown(event: CountdownEvent) {
    if (event.action === "done") {
     this.onSubmit();
    }
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
      this.store.dispatch(new HomeActions.ScoringTest(
        new TestSubmissionParam(this.test.id, Math.ceil(this.test.timeLimit - (this.countdown.left / 60000)), questions)));
    } else {
      // this.openSubmitDialog();
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
