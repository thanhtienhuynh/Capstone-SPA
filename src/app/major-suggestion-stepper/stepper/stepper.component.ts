import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GenernalHelperService } from 'src/app/_services/genernal-helper.service';
import { Mark } from 'src/app/_models/mark';
import { Subject } from 'src/app/_models/subject';
import { SuggestedSubjectsGroup } from 'src/app/_models/suggested-subjects-group';
import { University } from 'src/app/_models/university';
import * as fromApp from '../../_store/app.reducer';
import * as StepperActions from '../stepper/store/stepper.actions';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Test } from 'src/app/_models/test';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') private myStepper: MatStepper;

  secondFormGroup: FormGroup = null;
  thirdFormGroup: FormGroup;
  inputFormControl: FormGroup = null;

  subscription: Subscription;

  isLoading = true;
  subjects: Subject[] = [];
  marks: Mark[];
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  universities: University[];
  tests: ClassifiedTests[];
  test: Test;
  selectedTestId: number;

  isUniversityLoaded: boolean = false;

  subjectName = "";

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    public _generalService: GenernalHelperService,
  ) {}

  ngOnInit() {
    console.log("Init");
    this.secondFormGroup = this._formBuilder.group({});
    this.inputFormControl = this._formBuilder.group({});
    this.thirdFormGroup = this._formBuilder.group({});
    this.store.dispatch(new StepperActions.ResetState());
    this.store.dispatch(new StepperActions.LoadSubjects());

    this.subscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.subjects = stepperState.subjects;
          this.isLoading = stepperState.isLoading;
          this.suggestedSubjectsGroup = stepperState.suggestedSubjectsGroup;
          if ( stepperState.suggestedSubjectsGroup &&  stepperState.suggestedSubjectsGroup.length > 0) {
            this.myStepper.selectedIndex = 1;
          }
          this.universities = stepperState.universities;    
          if (stepperState.universities && stepperState.universities.length > 0) {
            this.myStepper.selectedIndex = 2;
          }      
          this.tests = stepperState.tests;
          if (stepperState.tests && stepperState.tests.length > 0) {
            this.myStepper.selectedIndex = 3;
          }
          this.test = stepperState.test;
          if (stepperState.test) {
            this.myStepper.selectedIndex = 4;
          }
          if (this.subjects && this.subjects.length > 0) {
            for (let subject of this.subjects) {
              this.secondFormGroup.addControl(
                subject.id.toString(),
                new FormControl("0", [Validators.required, Validators.min(0), Validators.max(10)])
              );
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onScoreSubmit() {
    this.marks = [];
    for(let subject of this.subjects) {
      this.marks.push({subjectId: subject.id, mark: this.secondFormGroup.value[subject.id] ? this.secondFormGroup.value[subject.id] : 0});
    }
    this.store.dispatch(new StepperActions.SetMarks(this.marks));
    if (!this.isLoading) {
      this.myStepper.selectedIndex = 1;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log("Destroy");
  }

  getUniversity(suggestedGroupId: number, majorId: number, totalMark: number) {
    this.store.dispatch(new StepperActions.LoadUniversities({subjectGroupId: suggestedGroupId, majorId: majorId, totalMark: totalMark}));
  }

  loadTests(universitiId: number) {
    this.store.dispatch(new StepperActions.LoadTests(universitiId));
    if (!this.isLoading) {
      this.myStepper.selectedIndex = 1;
    }
  }
  
  goBack(){
    this.myStepper.previous();
  }

  goForward(){
    this.myStepper.next();
  }

  getSubjectName(id: number) {
    this.subjectName = "";
    let subject = this.subjects.find(s => s.id === id);
    if (subject != null) {
      this.subjectName = subject.name;
    }
    return this.subjectName;
  }

  getUniversityName(id: number): string {
    return this.universities.find(u => u.id === id).name;
  }

  onTestSelected(id: number) {
    this.store.dispatch(new StepperActions.LoadTest(id));
  }
}
