import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NUMBER_OF_DEFAULT_COLUMNS } from 'src/app/_common/constants';
import { Mark } from 'src/app/_models/mark';
import { Subject } from 'src/app/_models/subject';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import { Test } from 'src/app/_models/test';
import { University } from 'src/app/_models/university';
import * as fromApp from '../../_store/app.reducer';
import * as StepperActions from '../stepper/store/stepper.actions';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  suggestedGroup: SuggestedSubjectsGroup;
  isUsed: boolean;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') private myStepper: MatStepper;

  isUniversityLoadedO: Observable<boolean>;

  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  subscription: Subscription;

  isLoading = true;
  subjects: Subject[];
  marks: Mark[];
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  universities: University[];
  tests: Test[];

  emptyTile: Tile = {suggestedGroup: null, cols: 1, rows: 1, color: 'transparent', isUsed: false};
  column: number = NUMBER_OF_DEFAULT_COLUMNS;
  isUniversityLoaded: boolean = false;

  colors: string[] = ['lightblue', 'lightgreen', 'lightpink', '#DDBDF1', 'lightred', 'lightyellow', 'lightblue', 'lightgrey'];

  finalResultTiles: Tile[] = [
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.secondFormGroup = this._formBuilder.group({});
    this.thirdFormGroup = this._formBuilder.group({
      resultType: [null, Validators.required],
    });

    this.store.dispatch(new StepperActions.LoadSubjects());

    this.subscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.subjects = stepperState.subjects;
          this.isLoading = stepperState.isLoading;
          this.suggestedSubjectsGroup = stepperState.suggestedSubjectsGroup;
          this.universities = stepperState.universities;
          this.tests = stepperState.tests;
          if (this.universities && this.universities.length > 0) {
            this.myStepper.selectedIndex = 2;
          }
          for (let subject of this.subjects) {
            this.secondFormGroup.addControl(
              subject.id.toString(),
              new FormControl(null)
            );
          }
          this.initResult();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onScoreSubmit() {
    // console.log(this.secondFormGroup.value);
    this.marks = [];
    for(let subject of this.subjects) {
      this.marks.push({subjectId: subject.id, mark: this.secondFormGroup.value[subject.id] ? this.secondFormGroup.value[subject.id] : 0});
    }
    // console.log(this.marks);
    this.store.dispatch(new StepperActions.SetMarks(this.marks));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initResult() {
    if (this.suggestedSubjectsGroup && this.suggestedSubjectsGroup.length > 0) {
      this.column = this.suggestedSubjectsGroup.length > NUMBER_OF_DEFAULT_COLUMNS ? this.suggestedSubjectsGroup.length : NUMBER_OF_DEFAULT_COLUMNS;
      
      let resultTiles: Tile[] = [];
      let emptyTiles: Tile[] = [];
      this.suggestedSubjectsGroup.forEach((suggestGroup, index) => {
        emptyTiles.push({ ...this.emptyTile, suggestedGroup: suggestGroup, rows: (this.suggestedSubjectsGroup.length - index)});
        resultTiles.push( {suggestedGroup: suggestGroup, cols: 1, rows: (this.suggestedSubjectsGroup.length - index + 1), color: this.colors[index], isUsed: true});
      });
      this.finalResultTiles = [];
      this.finalResultTiles = [...emptyTiles, ...resultTiles];
      console.log(this.finalResultTiles);
    }
  }

  getUniversity(suggestedGroupId: number, majorId: number, totalMark: number) {
    this.store.dispatch(new StepperActions.LoadUniversities({subjectGroupId: suggestedGroupId, majorId: majorId, totalMark: totalMark}));
  }

  loadTests(universitiId: number) {
    this.store.dispatch(new StepperActions.LoadTests(universitiId));
  }
  

  onSubmit() {
    // console.log(this.secondFormGroup.value);
  }
  
  goBack(){
    this.myStepper.previous();
  }

  goForward(){
    this.myStepper.next();
  }
}
