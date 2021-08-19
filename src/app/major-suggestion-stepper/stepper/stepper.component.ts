import { AfterContentInit, AfterViewInit, Component, DoCheck, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { CusSubjectGroup, SuggestedSubjectsGroup, UserSuggestionSubjectGroup } from 'src/app/_models/suggested-subjects-group';
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
import { Router } from '@angular/router';
import { MockTestRulesDialogComponent } from '../mock-test-rules-dialog/mock-test-rules-dialog.component';
import { CanComponentDeactivate } from 'src/app/_helper/can-deactivate-guard.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GroupMockTestDialogComponent } from '../group-mock-test-dialog/group-mock-test-dialog.component';
import { SpectrumDialogComponent } from '../spectrum-dialog/spectrum-dialog.component';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent extends CanComponentDeactivate implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('subjectGroupsInput') subjectGroupsInput: ElementRef<HTMLInputElement>;
  countStepperActionLoad: number = 0;
  typeScore: number = 2;
  gender: number = 1;
  provinceId: number;
  transcripts: TranscriptType[];
  provinceOptions: Province[];
  needDoneTestIds: number[] = [];

  //spectrum
  spectrum: number[] = [];
  isShowSpectrum: boolean = false;

  shouldLoadAtUniListStep = true;
  
  filteredOptions: Observable<Province[]>;

  subjectGroupsControl = new FormControl();
  subjecrGroupOptions: CusSubjectGroup[];
  selectedChips: CusSubjectGroup[] = [];
  filteredSubjectGroups: Observable<CusSubjectGroup[]>;


  provinceError = false;
  isFollowing = false;
  secondFormGroup: FormGroup = null;
  userSuggestionSubjectGroup: UserSuggestionSubjectGroup = null;

  subscription: Subscription;
  authSubscription: Subscription;
  userSubscription: Subscription;
  combineSubscription: Subscription;
  unsaveTestSubmissions: UnsaveTestSubmission[];
  stepperActionQueue: StepperActions.StepperActions[] = [];
  userActionQueue: UserActions.UserActions[] = [];

  selectedSubjectGroup: SuggestedSubjectsGroup = null;

  isAuthLoading = false;
  subjects: Subject[] = [];
  marks: Mark[];
  suggestedSubjectsGroup: SuggestedSubjectsGroup[];
  trainingProgramBasedUniversity: TrainingProgramBasedUniversity[];
  trainingProgramBasedUniversityForCheck: TrainingProgramBasedUniversity[];
  mockTestBasedUniversity: TrainingProgramBasedUniversity[];
  mockTestBasedUniversityForCheck: MockTestBasedUniversity;
  tests: ClassifiedTests[];
  test: Test;
  selectedTestId: number;
  suggestedMajorName: string;
  errors: string[];

  isUniversityLoaded: boolean = false;

  subjectName = "";
  searchTerm: string = null;
  user: User;

  groupPage = 1;
  math = Math;

  isDoingTest: boolean = false;
  isConfirmedOut: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    public _generalService: GenernalHelperService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    super();
    this.secondFormGroup = this._formBuilder.group({});
    this.secondFormGroup.addControl(
      'transcriptTypeId', new FormControl(1)
    );
    this.secondFormGroup.addControl(
      'gender', new FormControl(1)
    );
    this.secondFormGroup.addControl(
      'province', new FormControl(null, [Validators.required]), 
    );
  }

  ngOnInit() {
    this.store.dispatch(new StepperActions.ResetState());
    this.store.dispatch(new StepperActions.LoadSubjects());
    this.store.dispatch(new StepperActions.LoadTestConfig());
    this.store.dispatch(new StepperActions.LoadSubjectGroups());
    this.store.dispatch(new StepperActions.LoadProvinces());
    this.secondFormGroup.controls['transcriptTypeId'].valueChanges.subscribe(changeValue => {
      if (this.transcripts != null && this.transcripts.length > 0) {
        for (let transcriptType of this.transcripts) {
          if (transcriptType.id == changeValue) {
            this.subjects.forEach(subject => {
              let transcript = transcriptType.transcriptDetails.find(t => t.subjectId == subject.id);
              this.secondFormGroup.controls[subject.id].patchValue(transcript != null ? transcript.mark : 0);
              if (changeValue == 3) {
                this.secondFormGroup.controls[subject.id].disable();
              } else {
                this.secondFormGroup.controls[subject.id].enable();
              }
            });
            break;
          } else {
            this.subjects.forEach(subject => {
              this.secondFormGroup.controls[subject.id].patchValue(0);
              if (changeValue == 3) {
                this.secondFormGroup.controls[subject.id].disable();
              } else {
                this.secondFormGroup.controls[subject.id].enable();
              }
            });
          }
        }
      }
    })

    this.combineSubscription = combineLatest(this.store.select('stepper'),
      this.store.select('auth'), (stepperState, authState) => ({stepperState, authState}))
      .subscribe((state) => {
        this.stepperActionQueue = state.stepperState.actionsQueue;
        this.isAuthLoading = state.authState.isLoading;
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
            if (this.user && this.trainingProgramBasedUniversityForCheck && this.trainingProgramBasedUniversityForCheck.length > 0 && this.isFollowing) {
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
          if (this.suggestedSubjectsGroup != stepperState.suggestedSubjectsGroup) {
            this.suggestedSubjectsGroup = stepperState.suggestedSubjectsGroup;
          }
          if (this.spectrum != stepperState.spectrum) {
            this.spectrum = stepperState.spectrum;
            if (this.isShowSpectrum) {
              this.openSpectrum();
            }
          }
          this.needDoneTestIds = stepperState.needDoneTestIds;
          this.trainingProgramBasedUniversity = stepperState.trainingProgramBasedUniversity;    
          this.trainingProgramBasedUniversityForCheck = stepperState.trainingProgramBasedUniversity;
          if (this.tests != stepperState.tests) {
            this.tests = stepperState.tests;
          }
          if (this.subjecrGroupOptions != stepperState.subjectGroups) {
            this.subjecrGroupOptions = stepperState.subjectGroups;
            if (this.subjecrGroupOptions) {
              this.filteredSubjectGroups = this.subjectGroupsControl.valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterSubjectGroup(value) : this.subjecrGroupOptions.slice())
              );
            }
          }
          this.test = stepperState.test;
          if (this.mockTestBasedUniversityForCheck != stepperState.mockTestBasedUniversity) {
            this.mockTestBasedUniversityForCheck = stepperState.mockTestBasedUniversity;
            if (this.mockTestBasedUniversityForCheck) {
              this.mockTestBasedUniversity = stepperState.mockTestBasedUniversity.trainingProgramBasedUniversityDataSets;
            }
          }

          this.unsaveTestSubmissions = stepperState.unsaveTestSubmissions;

          if (this.selectedSubjectGroup != stepperState.selectedSubjectGroup) {
            this.selectedSubjectGroup = stepperState.selectedSubjectGroup;
          }

          if (this.isDoingTest != stepperState.isDoingTest) {
            this.isDoingTest = stepperState.isDoingTest;
          }

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
            if (stepperState.userSuggestionSubjectGroup != null) {
              // Đăng nhập ở giữa quá trình suggest
              if (this.myStepper && this.myStepper.selectedIndex >= 1) {
                // Người dùng có điểm trước đó
                let typeDiff = this.checkIsDiffentUserInfo();
                if (typeDiff > 0 && typeDiff < 3) {
                  Swal.fire({
                    title: '<div style=\"color: #033969\">Hệ thống ghi nhận bạn đã có thông tin gợi ý trước đó!</div>',
                    html: "<p style=\"font-weight: 500\">Bạn có muốn xem lại thông tin cũ hay không?</p><p style=\"color: red\">Lưu ý: Nếu bạn chọn 'Tiếp tục', hệ thống sẽ lưu thông tin mới của bạn.</p>",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Xem điểm cũ',
                    cancelButtonText: 'Tiếp tục'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.gender = this.userSuggestionSubjectGroup.gender;   
                      this.provinceId = this.userSuggestionSubjectGroup.provinceId;
                      if (this.provinceId && this.provinceId > 0) {
                        this.secondFormGroup.controls['province'].patchValue(this.provinceId);
                      }
    
                      this.transcripts = stepperState.userSuggestionSubjectGroup.transcriptDetails;
                      if (this.transcripts != null && this.transcripts.length > 0) {
                        for (let transcriptType of this.transcripts) {
                          if (transcriptType.id == this.typeScore) {
                            this.subjects.forEach(subject => {
                              let transcript = transcriptType.transcriptDetails.find(t => t.subjectId == subject.id);
                              this.secondFormGroup.controls[subject.id].patchValue(transcript != null ? transcript.mark : 0);
                              if (this.typeScore == 3) {
                                this.secondFormGroup.controls[subject.id].disable();
                              } else {
                                this.secondFormGroup.controls[subject.id].enable();
                              }
                            });
                            break;
                          } else {
                            this.subjects.forEach(subject => {
                              this.secondFormGroup.controls[subject.id].patchValue(0);
                              if (this.typeScore == 3) {
                                this.secondFormGroup.controls[subject.id].disable();
                              } else {
                                this.secondFormGroup.controls[subject.id].enable();
                              }
                            });
                          }
                        }
                      }
                      this.getAction(6);
                    } else {
                      this.store.dispatch(new StepperActions.SaveMarks());
                    }
                  })
                // Người dùng chưa có điểm trước đó
                } else if (typeDiff == 3) {
                  this.store.dispatch(new StepperActions.SaveMarks());
                }
              // Đăng nhập trước quá trình suggest
              } else {
                if (this.userSuggestionSubjectGroup.gender != null) {
                  this.gender = this.userSuggestionSubjectGroup.gender;
                }
                
                if (this.userSuggestionSubjectGroup.provinceId != null) {
                  this.provinceId = this.userSuggestionSubjectGroup.provinceId;
                }

                if (this.userSuggestionSubjectGroup.transcriptDetails != null && this.userSuggestionSubjectGroup.transcriptDetails.length > 0) {
                  this.typeScore =  this.userSuggestionSubjectGroup.transcriptDetails[0].id;
                }

                if (this.provinceId && this.provinceId > 0) {
                  this.secondFormGroup.controls['province'].patchValue(this.provinceId);
                }

                this.transcripts = stepperState.userSuggestionSubjectGroup.transcriptDetails;
                if (this.transcripts != null && this.transcripts.length > 0) {
                  for (let transcriptType of this.transcripts) {
                    if (transcriptType.id == this.typeScore) {
                      this.subjects.forEach(subject => {
                        let transcript = transcriptType.transcriptDetails.find(t => t.subjectId == subject.id);
                        this.secondFormGroup.controls[subject.id].patchValue(transcript != null ? transcript.mark : 0);
                        if (this.typeScore == 3) {
                          this.secondFormGroup.controls[subject.id].disable();
                        } else {
                          this.secondFormGroup.controls[subject.id].enable();
                        }
                      });
                      break;
                    } else {
                      this.subjects.forEach(subject => {
                        this.secondFormGroup.controls[subject.id].patchValue(0);
                        if (this.typeScore == 3) {
                          this.secondFormGroup.controls[subject.id].disable();
                        } else {
                          this.secondFormGroup.controls[subject.id].enable();
                        }
                      });
                    }
                  }
                }
              }
              
            }
          }
          
          this.errors = stepperState.errors;
          if (this.errors && this.errors.length > 0) {
            Swal.fire({title: 'Lỗi', text: this.errors.toString(), icon: 'error', allowOutsideClick: false})
            .then(() => {
              this.store.dispatch(new StepperActions.ConfirmErrors());
            });
          }
        },
        (error) => {
        }
      );

    this.userSubscription = this.store
    .select('user')
    .subscribe(
      (userState) => {
        this.userActionQueue = userState.actionsQueue;

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

  onSpectrumClick() {
    this.isShowSpectrum = true;
    this.store.dispatch(new StepperActions.LoadSpectrum());
  }

  remove(group: CusSubjectGroup): void {
    var index = this.selectedChips.indexOf(group);
    if (index !== -1) {
      this.selectedChips.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let group = this.subjecrGroupOptions.find(s => s.id == event.option.value);
    if (group) {
      if (!this.selectedChips.find(g => group.id == g.id)) {
        this.selectedChips.push(this.subjecrGroupOptions.find(s => s.id == event.option.value));
      }
      this.subjectGroupsInput.nativeElement.value = "";
      this.subjectGroupsControl.setValue(null);
    }
  }

  checkIsDiffentUserInfo() {
    if (!this.userSuggestionSubjectGroup) {
      return 3;
    }
    if (this.userSuggestionSubjectGroup.gender != this.gender) {
      return 1;
    }
    if (this.userSuggestionSubjectGroup.provinceId != this.provinceId) {
      return 1;
    }
    if (this.userSuggestionSubjectGroup.transcriptDetails != null &&
      this.userSuggestionSubjectGroup.transcriptDetails.find(u => u.id == this.typeScore) != null) {
      for (let mark of this.marks) {
        let isExisted = false;
        for (let transcript of this.userSuggestionSubjectGroup.transcriptDetails.find(u => u.id == this.typeScore).transcriptDetails) {
          //TH người dùng đã có điểm
          if (mark.subjectId == transcript.subjectId) {
            isExisted = true;
            if (mark.mark != transcript.mark) {
              return 2;
            }
          }
        }
        //TH người dùng chưa có điểm
        if (!isExisted) {
          return 2;
        }
      }
      return 0;
    } else {
      return 3;
    }
    //0: no diff
    //1: diff gender || province: asking
    //2: diff mark: asking
    //3: chưa có điểm 1 type => no asking
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
          this.openMockTestRulesDialog();
        break;
      case 4: //Từ 3 => 4
        this.myStepper.selectedIndex = 4;
        this.store.dispatch(new StepperActions.LoadTest(data));
        break;
      case 5: //Xem lai ket qua goi y 4 => 2
        this.myStepper.selectedIndex = 2;
        this.store.dispatch(new StepperActions.LoadAfterMockTestsUniversities());
        break;
      case 6: //Xem lại điểm cũ => từ mọi index => 0
        this.myStepper.selectedIndex = 0;
        break;
      case 7: // Từ 2 => 3
        this.myStepper.selectedIndex = 3;
        this.loadTests();
        break;
      case 8: // Từ 1 => 0, nhập điểm thpt qg
        this.myStepper.selectedIndex = 0;
        this.inputTHPTQGScroe();
        break;
      case 9: // Từ 1 => 3, thi thử dựa trên chọn khối
        this.openGroupMockTestRulesDialog();
        break;
      case 10: //Sau khi thi thử => về lại xem khối của 1 ngành, 4 => 1
        this.myStepper.selectedIndex = 1;
        this.typeScore = 3;
        this.store.dispatch(new StepperActions.LoadMajorsSelectedSubjectGroup());
      break;
      default:
        break;
    }
  }

  reloadUni(event: boolean) {
    if (event) {
      if (this.shouldLoadAtUniListStep) {
        this.getAction(5);
      } else {
        this.getAction(10);
      }
    }
  }

  backAfterDoingMockTest() {
  }

  reloadUserInfo() {
    if (this.user != null) {
      this.store.dispatch(new StepperActions.LoadUserSuggestion());
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

  searchSubmit() {
    if (!this.searchTerm || this.searchTerm.trim().length <= 0) {
      this.searchTerm = "";
    }
    const filterValue = this.searchTerm.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
    if (this.mockTestBasedUniversityForCheck?.trainingProgramBasedUniversityDataSets?.length > 0) {
      this.mockTestBasedUniversity = 
      this.mockTestBasedUniversityForCheck.trainingProgramBasedUniversityDataSets.filter(uni => 
        uni.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase().includes(filterValue));
    }

    if (this.trainingProgramBasedUniversityForCheck?.length > 0) {
      this.trainingProgramBasedUniversity = 
      this.trainingProgramBasedUniversityForCheck.filter(uni => 
        uni.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase().includes(filterValue));
    }
  }

  
  onSuggestSubmit() {
    this.groupPage = 1;
    if (!this.secondFormGroup.valid) {
     return;
    }
    this.marks = [];
    for(let subject of this.subjects) {
      this.marks.push({subjectId: subject.id, mark: this.secondFormGroup.getRawValue()[subject.id] ? this.secondFormGroup.getRawValue()[subject.id] : 0});
    }
    let typeDiff = this.checkIsDiffentUserInfo();
    if (this.user &&  typeDiff > 0 && typeDiff < 3) {
      Swal.fire({
        title: '<div style=\"color: #033969\">Hệ thống ghi nhận bạn đã thay đổi thông tin gợi ý!</div>',
        html: typeDiff == 1 ? `<p style=\"font-weight: 500; color: red\">Bạn đã thay đổi thông tin về Tỉnh/TP và Giới tính, điều này sẽ làm
                              bạn không còn phù hợp với một số trường đại học bạn đã theo dõi trước đó.</p>
                              <p style=\"font-weight: 500\">Bạn có chắc muốn thay đổi thông tin gợi ý hay không?</p>
                              <p style=\"color: red\">Nếu bạn đồng ý, vui lòng bấm \"Tiếp tục\".</p>`
                            : `<p style=\"font-weight: 500\">Bạn có chắc muốn thay đổi thông tin gợi ý hay không?</p>
                            <p style=\"color: red\">Nếu bạn đồng ý, vui lòng bấm \"Tiếp tục\".</p>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tiếp tục',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.getAction(1);
        } else {
          this.gender = this.userSuggestionSubjectGroup.gender;   
          this.provinceId = this.userSuggestionSubjectGroup.provinceId;
          if (this.provinceId && this.provinceId > 0) {
            this.secondFormGroup.controls['province'].patchValue(this.provinceId);
          }

          this.transcripts = this.userSuggestionSubjectGroup.transcriptDetails;
          if (this.transcripts != null && this.transcripts.length > 0) {
            for (let transcriptType of this.transcripts) {
              if (transcriptType.id == this.typeScore) {
                this.subjects.forEach(subject => {
                  let transcript = transcriptType.transcriptDetails.find(t => t.subjectId == subject.id);
                  this.secondFormGroup.controls[subject.id].patchValue(transcript != null ? transcript.mark : 0);
                  if (this.typeScore == 3) {
                    this.secondFormGroup.controls[subject.id].disable();
                  } else {
                    this.secondFormGroup.controls[subject.id].enable();
                  }
                });
                break;
              }
              // else {
              //   this.subjects.forEach(subject => {
              //     this.secondFormGroup.controls[subject.id].patchValue(0);
              //     if (this.typeScore == 3) {
              //       this.secondFormGroup.controls[subject.id].disable();
              //     } else {
              //       this.secondFormGroup.controls[subject.id].enable();
              //     }
              //   });
              // }
            }
          }
        }
      });
    } else {
      this.getAction(1);
    }
  }

  onScoreSubmit() {
    let subjectGroupIds = this.selectedChips.map(s => s.id);
    if (this.checkIsDiffentUserInfo() > 0) {
      this.store.dispatch(new StepperActions.SetMarks({marks: this.marks, transcriptTypeId: this.typeScore,
        gender: this.gender, provinceId: this.provinceId, subjectGroupIds: subjectGroupIds}, true));
    } else {
      this.store.dispatch(new StepperActions.SetMarks({marks: this.marks, transcriptTypeId: this.typeScore,
        gender: this.gender, provinceId: this.provinceId, subjectGroupIds: subjectGroupIds}, false));
    }
  }

  inputTHPTQGScroe() {
    this.secondFormGroup.controls['transcriptTypeId'].setValue(1);
  }

  getRatio(caring: number, admission: number) {
    if (admission) {
      return Math.round((caring / admission) * 100) / 100;
    }
    return null;
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
      major: major}));
  }

  loadTests() {
    this.store.dispatch(new StepperActions.SetTests([]));
    this.store.dispatch(new StepperActions.LoadTests());
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

  onCaringClick(universityId: number, trainingProgramId: number, followTransciptTypeId: number, position: number) {
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
      if (followTransciptTypeId == 3 || followTransciptTypeId == 1)  {
        this.store.dispatch(new StepperActions.CaringAction({trainingProgramId: trainingProgramId, universityId: universityId,
          followTranscriptTypeId: followTransciptTypeId, position: position}));
      } else if (followTransciptTypeId == 2) {
        let existInMockTestUni = this.mockTestBasedUniversityForCheck?.trainingProgramBasedUniversityDataSets?.find(t => t.id == universityId && t.trainingProgramSets.find(p => p.id == trainingProgramId) != null);
        if (existInMockTestUni) {
          followTransciptTypeId = 3;
        }
        this.store.dispatch(new StepperActions.CaringAction({trainingProgramId: trainingProgramId, universityId: universityId,
          followTranscriptTypeId: followTransciptTypeId, position: position}));
      }
    } 
  }

  openMockTestRulesDialog() {
    const dialogRef = this.dialog.open(
      MockTestRulesDialogComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: false
      }
    )

    dialogRef.afterClosed().subscribe(v => {
      if (v) {
        this.getAction(7);
        this.shouldLoadAtUniListStep = true;
      }
    });
  }

  openSpectrum() {
    const dialogRef = this.dialog.open(
      SpectrumDialogComponent, {
        width: '100%',
        height: 'auto',
        disableClose: false,
        data: {
          name: this.selectedSubjectGroup.name,
          score: this.totalMockTestMark
        }
      }
    )

    dialogRef.afterClosed().subscribe(v => {
      this.isShowSpectrum = false;
    });
  }

  openGroupMockTestRulesDialog() {
    const dialogRef = this.dialog.open(
      GroupMockTestDialogComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: false,
        data: {
          suggestedSubjectGroups: this.suggestedSubjectsGroup
        }
      }
    )

    dialogRef.afterClosed().subscribe(v => {
      if (v) {
        this.getAction(7);
        this.shouldLoadAtUniListStep = false;
      }
    });
  }

  totalMockTestMark: number = 0;
  getMockTestTotalMark() {
    this.totalMockTestMark = 0;
    for (let test of this.tests) {
      this.totalMockTestMark += test.lastTranscript;
    }
    return this.totalMockTestMark;
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

  onMoreClick() {
    if (this.groupPage < Math.ceil(this.suggestedSubjectsGroup.length / 3)) {
      this.groupPage++;
    }
  }

  onBackClick() {
    if (this.groupPage > 1) {
      this.groupPage--;
    }
  }

  getTotalActionQueues() {
    return [...this.userActionQueue, ...this.stepperActionQueue];
  }

  private _filter(value: string): Province[] {
    const filterValue = value.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
    return this.provinceOptions.filter(option => 
      option.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase().includes(filterValue));
  }

  private _filterSubjectGroup(value: string): CusSubjectGroup[] {
    const filterValue = value.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
    return this.subjecrGroupOptions.filter(option => 
      option.groupCode.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase().includes(filterValue));
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
    // if (scoreType.value === 2) {
    //   if (math.value < 5 || physics.value < 5 || chemistry.value < 5 || englis.value < 5 || biology.value < 5 || 
    //     geography.value < 5 || history.value < 5 || humanity.value < 5 || literaty.value < 5) {
    //     this.secondFormGroup.setErrors({mustHigherThanFive: 'Điểm học bạ các môn của bạn bắt buộc phải lớn hơn hoặc bằng 5 thì mới có thể xét tuyển đại học!'});
    //   } else {
    //     if (!this.provinceError) {
    //       this.secondFormGroup.setErrors(null);
    //     }
    //   }
    // } else if (scoreType.value === 1) {
    //   let count = 0;
    //   if (math.value != null && math.value > 0) {
    //     count++;
    //   }
    //   if (physics.value != null && physics.value > 0) {
    //     count++;
    //   }
    //   if (chemistry.value != null && chemistry.value > 0) {
    //     count++;
    //   }
    //   if (englis.value != null && englis.value > 0) {
    //     count++;
    //   }
    //   if (biology.value != null && biology.value > 0) {
    //     count++;
    //   }
    //   if (geography.value != null && geography.value > 0) {
    //     count++;
    //   }
    //   if (history.value != null && history.value > 0) {
    //     count++;
    //   }
    //   if (humanity.value != null && humanity.value > 0) {
    //     count++;
    //   }
    //   if (literaty.value != null && literaty.value > 0) {
    //     count++;
    //   }
    //   if (count < 6) {
    //     this.secondFormGroup.setErrors({atLeastSixSubjects: 'Bạn phải nhập tối thiểu 6 môn (bao gồm 3 môn bắt buộc và 1 tổ hợp môn là KHTN hoặc KHXH).'});
    //   }  else if (!((math.value && math.value > 1 && literaty.value && literaty.value > 1 && englis.value && englis.value > 1)
    //     && ((physics.value && physics.value > 1 && chemistry.value && chemistry.value > 1 && biology.value && biology.value > 1)
    //         || (history.value && history.value > 1 && geography.value && geography.value > 1 && humanity.value && humanity.value > 1)))
    //   ) {
    //     this.secondFormGroup.setErrors({mustEnoughSubjects: 'Điểm các môn thi bắt buộc phải lớn hơn 1 thì mới đủ điều kiện xét tuyển!'});
    //   } else if (
    //   (!(physics.value && physics.value > 1 && chemistry.value && chemistry.value > 1 && biology.value && biology.value > 1)
    //   && !((physics.value == null || physics.value == 0) &&  (chemistry.value == null || chemistry.value == 0) && (biology.value == null || biology.value == 0)))
    //   || (!(history.value && history.value > 1 && geography.value && geography.value > 1 && humanity.value && humanity.value > 1)
    //   && !((history.value == null || history.value == 0) &&  (geography.value == null || geography.value == 0) && (humanity.value == null || humanity.value == 0)))
    //   ) {
    //     this.secondFormGroup.setErrors({mustMatchGroup: 'Bạn phải nhập đủ điểm các môn trong tổ hợp môn KHTN hoặc KHXH!'});
    //   } else {
    //     if (!this.provinceError) {
    //       this.secondFormGroup.setErrors(null);
    //     }
    //   }
    // }
  }

  openUniversityNewWindow(id: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`customer/university/${id}`])
    );
    window.open(url, '_blank');
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
    if (!this.isDoingTest) {
      return true;
    } else {
      return Swal.fire({
        title: 'Bạn chưa hoàn thành bài thi!',
        text: "Chú ý: Nếu bạn thoát, hệ thống sẽ ghi nhận điểm của bạn đến thời điểm này?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Thoát',
        cancelButtonText: 'Tiếp tục'
      }).then((result) => {
        if (result.isConfirmed) {
          this.isConfirmedOut = true;
        }
        return result.isConfirmed;
      });
    } 
  }

  getClass(classId: number) {
    return "devided-class-" + classId;
  }

  getGender() {
    return this.gender == 1 ? "Nữ" : "Nam";
  }

  getTypeScore() {
    switch(this.typeScore) {
      case 1:
        return "THPT Quốc gia";
      case 2:
        return "Học bạ";
      case 3:
        return "Thi thử";
      default:
        return "";
    }
  }
  
}
