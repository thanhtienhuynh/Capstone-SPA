import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/_models/test';
import * as fromApp from "../../_store/app.reducer";
import * as StepperActions from "../stepper/store/stepper.actions";
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.scss']
})
export class ExamPageComponent implements OnInit, OnDestroy {
  params: Params;
  test: Test;

  subscription: Subscription;
  mathml="";
  sup1 = "<p appMath>";
  sup2 = "</p>";

  option: any;  
  selectedIndex: any;

  examInputForm: FormGroup;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>, public mediaObserver: MediaObserver) { }

  ngOnInit() {    

    const id = +this.route.snapshot.params['id'];    
    this.store.dispatch(new StepperActions.LoadTest(id));
    this.params = this.route.params.subscribe(
      (params) => {
        this.store.dispatch(new StepperActions.LoadTest(id));
      }
    );

  

    this.subscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          console.log(stepperState.test);
          this.test = stepperState.test;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  
  ngOnDestroy() {
    this.params.unsubscribe();
  }

  submitExam(): void {
    console.log('asldkgjlsdkg');
  }

  getOrderOfQuestion(index: number): void {
    this.selectedIndex = index;
  }
}
