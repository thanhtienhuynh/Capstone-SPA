import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { University, UniversityBaseOnTrainingProgram } from 'src/app/_models/university';
import * as fromApp from '../../_store/app.reducer';
import * as StepperActions from '../stepper/store/stepper.actions';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Test } from 'src/app/_models/test';
import { BIOLOGY_SUBJECT_NAME, CHEMISTRY_SUBJECT_NAME, ENGLISH_SUBJECT_NAME, GEOGRAPHY_SUBJECT_NAME, HISTORY_SUBJECT_NAME, HUMANITY_SUBJECT_NAME, LITERARY_SUBJECT_NAME, MATH_SUBJECT_NAME, PHYSICS_SUBJECT_NAME } from 'src/app/_common/constants';
import { MatDialog } from '@angular/material/dialog';
import { DetailUniversityDialogComponent } from './detail-university-dialog/detail-university-dialog.component';
import { ConfirmDialogComponent } from 'src/app/_sharings/components/confirm-dialog/confirm-dialog.component';
import { User } from 'src/app/_models/user';
import { LoginDialogComponent } from 'src/app/_sharings/components/login-dialog/login-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') private myStepper: MatStepper;
  typeScore: number = 1;

  secondFormGroup: FormGroup = null;
  thirdFormGroup: FormGroup;
  inputFormControl: FormGroup = null;

  subscription: Subscription;
  authSubscription: Subscription;

  isLoading = true;
  isAuthLoading = false;
  subjects: Subject[] = [];
  marks: Mark[];
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  universitiesBaseOnTrainingProgram: UniversityBaseOnTrainingProgram[];
  tests: ClassifiedTests[];
  test: Test;
  selectedTestId: number;
  suggestedMajorName: string;
  errors: string[];

  isUniversityLoaded: boolean = false;

  subjectName = "";
  user: User;

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    public _generalService: GenernalHelperService,
    public dialog: MatDialog
  ) {
    this.secondFormGroup = this._formBuilder.group({});
    this.secondFormGroup.addControl(
      'transcriptTypeId', new FormControl(1)
    );
  }

  ngOnInit() {
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
          this.universitiesBaseOnTrainingProgram = stepperState.universitiesBaseOnTrainingProgram;    
          if (stepperState.universitiesBaseOnTrainingProgram && stepperState.universitiesBaseOnTrainingProgram.length > 0) {
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
                new FormControl(0, [ Validators.min(0), Validators.max(10)])
              );
            }

            this.secondFormGroup.valueChanges.subscribe(c => {
              this.marksValidator();
            });
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
          this.isAuthLoading = authState.isLoading;
          this.user = authState.user;
          if (this.user && this.universitiesBaseOnTrainingProgram && this.universitiesBaseOnTrainingProgram.length > 0) {
            this.store.dispatch(new StepperActions.ReloadUniversities());
          }
        },
        (error) => {
        }
      );
     
  }

  onScoreSubmit() {
    this.marksValidator();
    if (this.secondFormGroup.valid) {
      this.marks = [];
      console.log(this.secondFormGroup);
      for(let subject of this.subjects) {
        this.marks.push({subjectId: subject.id, mark: this.secondFormGroup.value[subject.id] ? this.secondFormGroup.value[subject.id] : 0});
      }
      this.store.dispatch(new StepperActions.SetMarks({marks: this.marks, transcriptTypeId: this.typeScore}));
      if (!this.isLoading) {
        this.myStepper.selectedIndex = 1;
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getUniversity(suggestedGroupId: number, majorId: number, totalMark: number, majorName: string) {
    this.suggestedMajorName = majorName;
    this.store.dispatch(new StepperActions.LoadUniversities({subjectGroupId: suggestedGroupId, majorId: majorId, totalMark: totalMark}));
  }

  loadTests() {
    this.store.dispatch(new StepperActions.LoadTests());
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

  getUniversityName(trainingProgramId: number, uniId): string {
    return this.universitiesBaseOnTrainingProgram.find(t => t.id === trainingProgramId).universities.find(u => u.id === uniId).name;
  }

  onTestSelected(id: number) {
    this.store.dispatch(new StepperActions.RefreshTest());
    this.store.dispatch(new StepperActions.LoadTest(id));
  }

  openDetailDialog(university: University): void {
    const dialogRef = this.dialog.open(DetailUniversityDialogComponent, {
      width: '800px',
      height: '400px',
      disableClose: false,
      data: {
        university: university
      }
    });
  }

  onCaringClick(universityId: number, trainingProgramId: number) {
    if (this.user == null){
      this.dialog.open(
        LoginDialogComponent, {
          width: '350px',
          height: '150px',
          disableClose: false,
        }
      )
    } else {
      this.store.dispatch(new StepperActions.CaringAction({trainingProgramId: trainingProgramId, universityId: universityId}));
    }
  }

  onUncaringClick(universityId: number, trainingProgramId: number, universityName: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '140px',
      disableClose: false,
      data: "Bỏ quan tâm " + universityName + "?"
    });
    dialogRef.afterClosed()
    .subscribe((response) => {
      if (response === 1) {
        this.store.dispatch(new StepperActions.UncaringAction({trainingProgramId: trainingProgramId, universityId: universityId}));
      }
    });
  }

  marksValidator() {
    const math = this.secondFormGroup.controls[this.subjects.find(s => s.name === MATH_SUBJECT_NAME).id];
    const physics = this.secondFormGroup.controls[this.subjects.find(s => s.name === PHYSICS_SUBJECT_NAME).id];
    const chemistry = this.secondFormGroup.controls[this.subjects.find(s => s.name === CHEMISTRY_SUBJECT_NAME).id];
    const englis = this.secondFormGroup.controls[this.subjects.find(s => s.name === ENGLISH_SUBJECT_NAME).id];
    const biology = this.secondFormGroup.controls[this.subjects.find(s => s.name === BIOLOGY_SUBJECT_NAME).id];
    const geography = this.secondFormGroup.controls[this.subjects.find(s => s.name === GEOGRAPHY_SUBJECT_NAME).id];
    const history = this.secondFormGroup.controls[this.subjects.find(s => s.name === HISTORY_SUBJECT_NAME).id];
    const humanity = this.secondFormGroup.controls[this.subjects.find(s => s.name === HUMANITY_SUBJECT_NAME).id];
    const literaty = this.secondFormGroup.controls[this.subjects.find(s => s.name === LITERARY_SUBJECT_NAME).id];
    const scoreType = this.secondFormGroup.controls['transcriptTypeId'];
    if (scoreType.value === 1) {
      if (math.value < 5 || physics.value < 5 || chemistry.value < 5 || englis.value < 5 || biology.value < 5 || 
        geography.value < 5 || history.value < 5 || humanity.value < 5 || literaty.value < 5) {
        this.secondFormGroup.setErrors({mustHigherThanFive: 'Điểm học bạ các môn của bạn bắt buộc phải lớn hơn hoặc bằng 5 thì mới có thể xét tuyển đại học!'});
      } else {
        this.secondFormGroup.setErrors(null);
      }
    } else {
      let count = 0;
      if (math.value != null && math.value > 0) {
        count++;
      }
      if (physics.value != null && physics.value > 0) {
        count++;
      }
      if (chemistry.value != null && chemistry.value > 0) {
        count++;
      }
      if (englis.value != null && englis.value > 0) {
        count++;
      }
      if (biology.value != null && biology.value > 0) {
        count++;
      }
      if (geography.value != null && geography.value > 0) {
        count++;
      }
      if (history.value != null && history.value > 0) {
        count++;
      }
      if (humanity.value != null && humanity.value > 0) {
        count++;
      }
      if (literaty.value != null && literaty.value > 0) {
        count++;
      }
      if (count < 6) {
        this.secondFormGroup.setErrors({atLeastSixSubjects: 'Bạn phải nhập tối thiểu 6 môn (bao gồm 3 môn bắt buộc và 1 tổ hợp môn là KHTN hoặc KHXH).'});
      }  else if (!((math.value && math.value >= 1 && literaty.value && literaty.value >= 1 && englis.value && englis.value >= 1)
        && (
            (physics.value && physics.value >= 1 && chemistry.value && chemistry.value >= 1 && biology.value && biology.value >= 1)
            || (history.value && history.value >= 1 && geography.value && geography.value >= 1 && humanity.value && humanity.value >= 1)))
      ) {
        this.secondFormGroup.setErrors({mustEnoughSubjects: 'Điểm các môn trong tổ hợp môn phải lớn hơn hoặc bằng 1 thì mới đủ điều kiện xét tuyển!'});
      } else if (
      (!(physics.value && physics.value >= 1 && chemistry.value && chemistry.value >= 1 && biology.value && biology.value >= 1)
      && !((physics.value == null || physics.value == 0) &&  (chemistry.value == null || chemistry.value == 0) && (biology.value == null || biology.value == 0)))
      || (!(history.value && history.value >= 1 && geography.value && geography.value >= 1 && humanity.value && humanity.value >= 1)
      && !((history.value == null || history.value == 0) &&  (geography.value == null || geography.value == 0) && (humanity.value == null || humanity.value == 0)))
      ) {
        this.secondFormGroup.setErrors({mustMatchGroup: 'Bạn phải nhập đủ điểm các môn trong tổ hợp môn KHTN hoặc KHXH!'});
      }
       else {
        this.secondFormGroup.setErrors(null);
      }
    }
  }
}
