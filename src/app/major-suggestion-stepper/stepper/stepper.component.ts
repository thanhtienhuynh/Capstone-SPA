import { AfterContentInit, AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { GenernalHelperService } from 'src/app/_services/genernal-helper.service';
import { Mark } from 'src/app/_models/mark';
import { Subject } from 'src/app/_models/subject';
import { SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from 'src/app/_models/suggested-subjects-group';
import { MockTestBasedUniversity, TrainingProgramBasedUniversity } from 'src/app/_models/university';
import * as fromApp from '../../_store/app.reducer';
import * as StepperActions from '../stepper/store/stepper.actions';
import * as UserActions from '../../user/store/user.actions';
import { ClassifiedTests } from 'src/app/_models/classified-tests';
import { Test } from 'src/app/_models/test';
import { BIOLOGY_SUBJECT_NAME, CHEMISTRY_SUBJECT_NAME, ENGLISH_SUBJECT_NAME, GEOGRAPHY_SUBJECT_NAME, HISTORY_SUBJECT_NAME, HUMANITY_SUBJECT_NAME, LITERARY_SUBJECT_NAME, MATH_SUBJECT_NAME, PHYSICS_SUBJECT_NAME } from 'src/app/_common/constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_sharings/components/confirm-dialog/confirm-dialog.component';
import { User } from 'src/app/_models/user';
import { LoginDialogComponent } from 'src/app/_sharings/components/login-dialog/login-dialog.component';
import Swal from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';
import { Province } from 'src/app/_models/province';
import { Major } from 'src/app/_models/major';
import { UnsaveTestSubmission } from 'src/app/_params/question-param';
import { TranscriptType } from 'src/app/_models/transcript';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  countStepperActionLoad: number = 0;
  typeScore: number = 2;
  gender: number = 1;
  provinceId: number;
  transcripts: TranscriptType[];
  provinceOptions: Province[];
  doneTestIds: number[] = [];
  filteredOptions: Observable<Province[]>;
  provinceError = false;
  isFollowing = false;
  secondFormGroup: FormGroup = null;
  thirdFormGroup: FormGroup;
  inputFormControl: FormGroup = null;
  userSuggestionSubjectGroup: UserSuggestionSubjectGroup = null;

  subscription: Subscription;
  authSubscription: Subscription;
  userSubscription: Subscription;
  combineSubscription: Subscription;
  unsaveTestSubmissions: UnsaveTestSubmission[];


  isLoading = true;
  isAuthLoading = false;
  isUserLoading = false;
  subjects: Subject[] = [];
  marks: Mark[];
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  trainingProgramBasedUniversity: TrainingProgramBasedUniversity[];
  mockTestBasedUniversity: MockTestBasedUniversity;
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
    this.secondFormGroup.addControl(
      'gender', new FormControl(1)
    );
    this.secondFormGroup.addControl(
      'province', new FormControl()
    );
  }

  ngOnInit() {
    this.inputFormControl = this._formBuilder.group({});
    this.thirdFormGroup = this._formBuilder.group({});
    this.store.dispatch(new StepperActions.ResetState());
    this.store.dispatch(new StepperActions.LoadSubjects());
    this.store.dispatch(new StepperActions.LoadProvinces());
    this.secondFormGroup.controls['transcriptTypeId'].valueChanges.subscribe(changeValue => {
      if (this.transcripts) {
        this.transcripts.forEach(transcriptType => {
         if (transcriptType.id == changeValue) {
          transcriptType.transcriptDetails.forEach(v => {
            this.secondFormGroup.controls[v.subjectId].patchValue(v.mark);
          })
         }
        });
      }
    })

    this.combineSubscription = combineLatest(this.store.select('stepper'),
      this.store.select('auth'), (stepperState, authState) => ({stepperState, authState}))
      .subscribe((state) => {
        this.isAuthLoading = state.authState.isLoading;
        this.isLoading = state.stepperState.isLoading;
        this.countStepperActionLoad = state.stepperState.actionCount;
        if (this.user != state.authState.user || this.provinceOptions != state.stepperState.provinces) {
          if (this.provinceOptions != state.stepperState.provinces) {
            this.provinceOptions = state.stepperState.provinces;
            if (this.provinceOptions) {
              this.filteredOptions = this.secondFormGroup.controls['province'].valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filter(value) : this.provinceOptions.slice())
              );
            }
          }
          
          if (this.user != state.authState.user) {
            this.user = state.authState.user;
            if (this.user && this.trainingProgramBasedUniversity && this.trainingProgramBasedUniversity.length > 0 && this.isFollowing) {
              this.store.dispatch(new StepperActions.ReloadUniversities());
              this.isFollowing = false;
            }
          }

          if (this.provinceOptions && this.provinceOptions.length > 0 && this.user) {
            this.store.dispatch(new StepperActions.LoadUserSuggestion());
          }
        }
      });
    
    this.subscription = this.store
      .select('stepper')
      .subscribe(
        (stepperState) => {
          this.isLoading = stepperState.isLoading;
          if (this.suggestedSubjectsGroup != stepperState.suggestedSubjectsGroup) {
            this.suggestedSubjectsGroup = stepperState.suggestedSubjectsGroup;
            if (this.suggestedSubjectsGroup && this.suggestedSubjectsGroup.length > 0) {
              this.getAction(6);
            }
          }
          this.doneTestIds = stepperState.doneTestIds;
          this.trainingProgramBasedUniversity = stepperState.trainingProgramBasedUniversity;         
          this.tests = stepperState.tests;
          this.test = stepperState.test;
          this.mockTestBasedUniversity = stepperState.mockTestBasedUniversity;
          this.unsaveTestSubmissions = stepperState.unsaveTestSubmissions;

           //load subjects
          if (this.subjects != stepperState.subjects) {
            this.subjects = stepperState.subjects
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
          }

          //load user suggestion
          if (this.userSuggestionSubjectGroup != stepperState.userSuggestionSubjectGroup) {
            this.userSuggestionSubjectGroup = stepperState.userSuggestionSubjectGroup;

            if (stepperState.userSuggestionSubjectGroup) {
              Swal.fire({
                title: 'Hệ thống ghi nhận bạn đã có kết quả gợi ý từ lần đăng nhập trước',
                text: "Bạn có muốn xem lại kết quả cũ?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xem kết quả cũ',
                cancelButtonText: 'Tiếp tục'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.gender = this.userSuggestionSubjectGroup.gender;

              this.typeScore = this.userSuggestionSubjectGroup.transcriptTypeId;
              if (this.typeScore && this.typeScore > 0) {
                this.secondFormGroup.controls['transcriptTypeId'].patchValue(this.typeScore);
              }

              this.provinceId = this.userSuggestionSubjectGroup.provinceId;
              if (this.provinceId && this.provinceId > 0) {
                this.secondFormGroup.controls['province'].patchValue(this.provinceId);
              }

              if (this.userSuggestionSubjectGroup.subjectGroupDataSets) {
                this.store.dispatch(new StepperActions.UpdateUserSuggestion());
              }

              this.transcripts = stepperState.userSuggestionSubjectGroup.transcriptDetails;
              if (this.transcripts) {
                this.transcripts.forEach(transcriptType => {
                  if (transcriptType.id == this.typeScore) {
                    transcriptType.transcriptDetails.forEach(v => {
                      this.secondFormGroup.controls[v.subjectId].patchValue(v.mark);
                    });
                  }
                });
              }
                }
              })
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
         
        },
        (error) => {
        }
      );

      this.userSubscription = this.store
      .select('user')
      .subscribe(
        (userState) => {
          this.isUserLoading = userState.isLoading;
        },
        (error) => {
        }
      );
  }

  ngAfterViewInit() {
    if (this.suggestedSubjectsGroup && this.suggestedSubjectsGroup.length > 0) {
      this.getAction(6);
    }
  }

  getAction(actionId: number, data?: any) {
    switch (actionId) {
      case 1: // Từ 0 => 1
        this.myStepper.selectedIndex = 1;
        this.onScoreSubmit();
        break;
      case 2: // Từ 1 => 2
        this.myStepper.selectedIndex = 2;
        this.isFollowing = true;
        this.getUniversity(data.suggestedSubjectsGroup, data.major);
        break;
      case 3: // Từ 2 => 3
        this.myStepper.selectedIndex = 3;
        this.loadTests();
        break;
      case 4: //Từ 3 => 4
        this.myStepper.selectedIndex = 4;
        this.store.dispatch(new StepperActions.RefreshTest());
        this.store.dispatch(new StepperActions.LoadTest(data));
        break;
      case 5: //Xem lai ket qua goi y 4 => 2
        this.myStepper.selectedIndex = 2;
        this.isFollowing = true;
        this.store.dispatch(new StepperActions.LoadAfterMockTestsUniversities());
        break;
      case 6: //Xem ket qua goi y cũ khi đăng nhập 0 => 1
        this.myStepper.selectedIndex = 1;
        break;
      default:
        break;
    }
  }

  reloadUni(event: boolean) {
    if (event) {
      this.getAction(5);
    }
  }

  backAfterDoingMockTest() {
    if (this.doneTestIds.length == this.tests.length && this.doneTestIds.length > 0) {
      this.getAction(5);
    }
  }

  getProvinceName(provinceId: number) {
    return this.provinceOptions.find(p => p.id === provinceId)?.name;
  }

  getSubjectNames(subjectGroup: SuggestedSubjectsGroup) {
    let subjectNames = "";
    if (subjectGroup.subjectDataSets && subjectGroup.subjectDataSets.length > 0) {
      subjectGroup.subjectDataSets.forEach(element => {
        if (subjectNames != "") {
          subjectNames += ", ";
        }
        subjectNames += element.name;
      });
    }
    if (subjectGroup.specialSubjectGroups && subjectGroup.specialSubjectGroups.length > 0) {
      subjectGroup.specialSubjectGroups.forEach(element => {
        if (subjectNames != "") {
          subjectNames += ", ";
        }
        subjectNames += element.name;
      });
    }
    return "Khối này gồm các môn: " + subjectNames;
  }
  

  onScoreSubmit() {
    this.marksValidator();
    if (this.secondFormGroup.valid) {
      this.marks = [];
      for(let subject of this.subjects) {
        this.marks.push({subjectId: subject.id, mark: this.secondFormGroup.value[subject.id] ? this.secondFormGroup.value[subject.id] : 0});
      }
      this.store.dispatch(new StepperActions.SetMarks({marks: this.marks, transcriptTypeId: this.typeScore, gender: this.gender, provinceId: this.provinceId}));
      if (!this.isLoading) {
        this.myStepper.selectedIndex = 1;
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.combineSubscription) {
      this.combineSubscription.unsubscribe();
    }
  }

  getUniversity(suggestedGroup: SuggestedSubjectsGroup, major: Major) {
    this.suggestedMajorName = major.name;
    this.store.dispatch(new StepperActions.LoadUniversities({subjectGroup: suggestedGroup,
      major: major, gender: this.gender, provinceId: null}));
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

  onTestSelected(id: number) {
    this.getAction(4, id);
  }

  onCaringClick(universityId: number, trainingProgramId: number, followTransciptTypeId: number) {
    if (this.user == null) {
      this.isFollowing = true;
      this.dialog.open(
        LoginDialogComponent, {
          width: '350px',
          height: '150px',
          disableClose: false,
        }
      )
    } else {
      if (this.unsaveTestSubmissions && this.unsaveTestSubmissions.length > 0) {
        this.store.dispatch(new StepperActions.SaveUnsaveTestSubmissions());
      }
      if (followTransciptTypeId == 3 || followTransciptTypeId == 2)  {
        this.store.dispatch(new StepperActions.CaringAction({trainingProgramId: trainingProgramId, universityId: universityId, followTranscriptTypeId: followTransciptTypeId}));
      } else if (followTransciptTypeId == 1) {
        let existInMockTestUni = this.mockTestBasedUniversity?.trainingProgramBasedUniversityDataSets?.find(t => t.id == universityId && t.trainingProgramSets.find(p => p.id == trainingProgramId) != null);
        if (existInMockTestUni) {
          followTransciptTypeId = 3;
        }
        this.store.dispatch(new StepperActions.CaringAction({trainingProgramId: trainingProgramId, universityId: universityId, followTranscriptTypeId: followTransciptTypeId}));
      }
    } 
  }

  onUncaringClick(followingDetailId: number, universityName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '140px',
      disableClose: false,
      data: "Bỏ quan tâm " + universityName + "?"
    });
    dialogRef.afterClosed()
    .subscribe((response) => {
      if (response === 1) {
        this.store.dispatch(new StepperActions.UncaringAction(followingDetailId));
      }
    });
  }

  private _filter(value: string): Province[] {
    const filterValue = value.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
    return this.provinceOptions.filter(option => 
      option.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase().includes(filterValue));
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
    const province = this.secondFormGroup.controls['province'].value;
    if (!this.provinceOptions.some(s => s.id === province)) {
      this.secondFormGroup.setErrors({provinceError: 'aaa'});
      this.provinceError = true;
    } else {
      this.provinceError = false;
    }
    if (scoreType.value === 2) {
      if (math.value < 5 || physics.value < 5 || chemistry.value < 5 || englis.value < 5 || biology.value < 5 || 
        geography.value < 5 || history.value < 5 || humanity.value < 5 || literaty.value < 5) {
        this.secondFormGroup.setErrors({mustHigherThanFive: 'Điểm học bạ các môn của bạn bắt buộc phải lớn hơn hoặc bằng 5 thì mới có thể xét tuyển đại học!'});
      } else {
        if (!this.provinceError) {
          this.secondFormGroup.setErrors(null);
        }
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
      }  else if (!((math.value && math.value > 1 && literaty.value && literaty.value > 1 && englis.value && englis.value > 1)
        && ((physics.value && physics.value > 1 && chemistry.value && chemistry.value > 1 && biology.value && biology.value > 1)
            || (history.value && history.value > 1 && geography.value && geography.value > 1 && humanity.value && humanity.value > 1)))
      ) {
        this.secondFormGroup.setErrors({mustEnoughSubjects: 'Điểm các môn thi bắt buộc phải lớn hơn 1 thì mới đủ điều kiện xét tuyển!'});
      } else if (
      (!(physics.value && physics.value > 1 && chemistry.value && chemistry.value > 1 && biology.value && biology.value > 1)
      && !((physics.value == null || physics.value == 0) &&  (chemistry.value == null || chemistry.value == 0) && (biology.value == null || biology.value == 0)))
      || (!(history.value && history.value > 1 && geography.value && geography.value > 1 && humanity.value && humanity.value > 1)
      && !((history.value == null || history.value == 0) &&  (geography.value == null || geography.value == 0) && (humanity.value == null || humanity.value == 0)))
      ) {
        this.secondFormGroup.setErrors({mustMatchGroup: 'Bạn phải nhập đủ điểm các môn trong tổ hợp môn KHTN hoặc KHXH!'});
      } else {
        if (!this.provinceError) {
          this.secondFormGroup.setErrors(null);
        }
      }
    }
  }
  
}
