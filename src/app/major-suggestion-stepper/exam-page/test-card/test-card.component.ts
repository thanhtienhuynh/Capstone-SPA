import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/_models/test';
import * as fromApp from '../../../_store/app.reducer';
import * as StepperActions from '../../stepper/store/stepper.actions';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss']
})
export class TestCardComponent implements OnInit, OnDestroy {
  @Input() test: Test;
  @Output() testSelected = new EventEmitter<number>();
  doneTestIds: number[] = [];
  subscription: Subscription;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.doneTestIds = stepperState.doneTestIds;
        },
        (error) => {
        }
      );
  }

  loadTest(id: number) {
    this.testSelected.emit(id);
  }

  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
