import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Test } from 'src/app/_models/test';
import * as fromApp from '../../../_store/app.reducer';
import * as StepperActions from '../../stepper/store/stepper.actions';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss']
})
export class TestCardComponent implements OnInit, OnDestroy {
  @Input('test') classifyTest: ClassifiedTests;
  @Output() testSelected = new EventEmitter<number>();
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    
  }

  loadTest(id: number) {
    this.testSelected.emit(id);
  }

  
  ngOnDestroy() {

  }

}
