import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdmissionMethodService, MajorService, TrainingProgramService, UniversityService } from 'src/app/admin/services';
import { AdmissionMethod, MajorConfiguration, MajorDetailUniversity, MajorSubjectGroup, MajorUniversity, Province, Season, subjectGroupTmp } from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MajorConfigurationModalComponent } from '../../../../major-configuration/components';

@Component({
  selector: 'app-action-major-modal',
  templateUrl: './action-major-modal.component.html',
  styleUrls: ['./action-major-modal.component.scss']
})


export class ActionMajorModalComponent implements OnInit, OnChanges {
 
  
  //DECORATOR
  @Input() data: MajorUniversity | undefined;
  @Input() listOfMajor: MajorUniversity[] = []
  @Input() universityName: string;
  @Input() universityId: any;  
  @Input() changeSeasonId: (seasonId: number) => void;

  @Output() seasonId = new EventEmitter<any>();

  modalTitle: string = 'Thêm ngành của ';

  isLoadingAdd: boolean = false;
  isLoadingUpdate: boolean = false;
  nation = environment.nation;
  initSeasonId = environment.initSeasonId

  //FORMGROUP
  majorForm: FormGroup;
  updateMajorForm: FormGroup;

  majorResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);
  listOfDisplayMajorResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);

  subjectGroupResult: Observable<Response<MajorSubjectGroup[]>> = new BehaviorSubject<Response<MajorSubjectGroup[]>>({} as Response<MajorSubjectGroup[]>);
  trainingProgramResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);
  provinceResult: Observable<Province[]> = new BehaviorSubject<Province[]>({} as Province[]);

  listOfDisplaySubjectGroup: Observable<MajorSubjectGroup[]> = new BehaviorSubject<MajorSubjectGroup[]>({} as MajorSubjectGroup[]);
  
  tmpUpdatingUniSubAdmissionParams: any[] = [];
  tmpSubjectGroup: any[] = [];

  listOfProvince: Province[];
  listOfMajors: MajorUniversity[] = [];
  listOfMajorSubjectGroup: MajorSubjectGroup[];
  listOfSeason: Season[] = [];
  listOfAdmissionMethod: AdmissionMethod[] = [];

  majorName: any;

  get handleUpdatingUniSubAdmissionParams(): any[] {
    return this.tmpUpdatingUniSubAdmissionParams;
  };
  get getSubAddmissions(): FormArray {
    return this.majorForm.get('subAdmissions') as FormArray
  }
  get updatingUniSubAdmissionParams(): FormArray {
    return this.updateMajorForm.get('updatingUniSubAdmissionParams') as FormArray
  }
  
  get handleTmpSubjectGroup(): any[] {
    return this.tmpSubjectGroup;
  };

  
  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _majorService: MajorService,
    private _trainingProgramService: TrainingProgramService,
    private _addmissionMethodService: AdmissionMethodService,
    private _universityService: UniversityService,
    private _modalService: NzModalService,
  ) {
    this.initMajorForm();
    this.initUpdateFormMajor();
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit() {
    this.getListOfMajor();
    this.getListOfTrainingProgram([]);
    this.getAddmissionMethod();
    this.getProvince();
    this.getListOfSeason();    
    this.getMajorOfUniversityNonePaging(this.universityId, this.majorForm.get('seasonId').value);
    if (this.data === undefined) {
      this.modalTitle = 'THÊM NGÀNH CỦA ' + `${this.universityName.toUpperCase()}`;
    }
  }

  getListOfSeason(): void {
    this._universityService.getListOfSeason().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.listOfSeason = [...rs.data];                     
        } else {

        }
      }),
      catchError(err => {
        return of(undefined);
      })
    ).subscribe();
  }

  getMajorOfUniversityNonePaging(uniId: string, seasonId: string): void {
    this._universityService.getMajorOfUniversityNonePaging(uniId, seasonId).pipe(
      tap(rs => {
        if (rs.succeeded === true) {                    
          this.listOfMajors = [...rs.data];          
          if (this.majorName === undefined) {
            return;
          }                  
          const a = this.listOfMajors?.find(rs => rs.majorId === this.majorName.id) !== undefined ? this.listOfMajors.find(rs => rs.majorId === this.majorName.id).majorDetailUnies.map(rs => rs.trainingProgramId) : [];          
          this.getListOfTrainingProgram(a as number[]);
        } else {

        }
      })
    ).subscribe();
  }

  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'majorId': [undefined, Validators.required],
      'majorCode': [''],
      'trainingProgramId': [undefined, Validators.required],
      'totalAdmissionQuantity': ['', Validators.min(1)],
      'seasonId': [this.initSeasonId, Validators.required],
      'subAdmissions': this._fb.array([
        this._fb.group({
          'genderId': [1000, Validators.required],
          'admissionMethodId': [1, Validators.required],
          'provinceId': [this.nation, Validators.required],
          'quantity': ['', Validators.min(1)],
          'subjectGroups': this._fb.array([]),
        }),
      ]),
    });
  };

  addMajor(): void {
    this.isLoadingAdd = true;
    const majorId = this.majorForm.get('majorId').value.id;
    const trainingProgramId = this.majorForm.get('trainingProgramId').value.id;
    const subAdmissionsTmp = this.getSubAddmissions.controls.map(rs => rs.value);
    const subAdmissions = subAdmissionsTmp.map((rs) => {
      const subjectGroups = rs.subjectGroups.map((rss) => {
        const tmpsubjectGroups = { ...rss, 'majorSubjectGroupId': rss.majorSubjectGroupId.id }
        return tmpsubjectGroups;
      });
      const genderId = rs.genderId === 1000 ? null : rs.genderId;
      const admissionMethodId = rs.admissionMethodId === 3 ? null : rs.admissionMethodId;
      const subAdmissionsTmp = { ...rs, 'provinceId': rs.provinceId.id !== 1000 ? rs.provinceId.id : null, 'subjectGroups': subjectGroups, 'genderId': genderId, 'admissionMethodId': admissionMethodId }
      return subAdmissionsTmp;
    }
    );
    const newValue = { ...this.majorForm.value, 'majorId': majorId, 'trainingProgramId': trainingProgramId, 'subAdmissions': subAdmissions, 'universityId': parseInt(this.universityId) }    
    this._universityService.majorAddition(newValue).pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoadingAdd = false;
          Swal.fire({ position: 'center', icon: 'success', title: 'Thành Công', showConfirmButton: false, timer: 1500 });
          this.changeSeasonId(this.majorForm.get('seasonId').value);          
          this.closeModal();                    
        } else {
          this.isLoadingAdd = false;
          Swal.fire({ position: 'center', icon: 'error', title: 'Thất Bại', text: rs.errors[0], showConfirmButton: false, timer: 1500 });
        }
      })
    ).subscribe();      
    
    this.closeModal();                  
  }  

  addSubAddmissions(): void {
    this.getSubAddmissions.push(
      this._fb.group({
        'genderId': [1000, Validators.required],
        'admissionMethodId': [1, Validators.required],
        'provinceId': [this.nation, Validators.required],
        'quantity': ['', Validators.min(1)],
        'subjectGroups': this._fb.array([
          this._fb.group({
            "majorSubjectGroupId": [undefined, Validators.required],
            "entryMarkPerGroup": ['']
          })
        ])
      }));
  };

  addSubjectGroup(submissionIndex: number, data?: any, flag?: number): void {
    const subAddmission = this.getSubAddmissions.controls[submissionIndex];
    const subjectGroup = subAddmission.get('subjectGroups') as FormArray;
    subjectGroup.push(
      this._fb.group({
        "majorSubjectGroupId": [data, Validators.required],
        "entryMarkPerGroup": ['']
      })
    );
  }

  removeSubAddmission(index: number) {
    this.getSubAddmissions.removeAt(index);
  }

  removeSubjectGroup(submissionIndex: number, subjectGroupIndex: number) {
    const subAddmission = this.getSubAddmissions.controls[submissionIndex];
    const subjectGroup = subAddmission.get('subjectGroups') as FormArray;
    subjectGroup.removeAt(subjectGroupIndex);
  }

  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  

  getProvince(): void {
    this._addmissionMethodService.getProvince().pipe(
      tap(rs => {
        this.listOfProvince = [...rs.data];
        if (this.listOfProvince !== undefined) {
          if (this.data !== undefined) {
            this.modalTitle = 'SỬA THÔNG TIN NGÀNH ' + `${this.data.majorName.toUpperCase()}` + ` CỦA ` + `${this.universityName.toUpperCase()}`;
            this.getMajorSubjectGroup(this.data.majorId as number)
          }
        }
      })
    ).subscribe();
    this.provinceResult = this._addmissionMethodService.getProvince().pipe(
      map(rs => [this.nation].concat(rs.data))
    )
  }

  getListOfMajor(): void {
    this.majorResult = this._majorService.getAllMajor().pipe();
    this.listOfDisplayMajorResult = this.majorResult.pipe(
      map(rs => rs.data),
    );
  };

  getListOfTrainingProgram(exited: number[]): void {
    this.trainingProgramResult = this._trainingProgramService.getAllTrainingProgram().pipe(
      map((rs) => exited !== [] ? rs.data.filter(rss => rss.id !== exited.find(rsss => rsss === rss.id)) : rs.data),
      tap(rs => {
        if (rs) {
          this.majorForm.get('trainingProgramId').setValue(rs[0])
        }
      })
    );
  };

  getAddmissionMethod(): void {
    this._addmissionMethodService.getAddmissionMethod().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.listOfAdmissionMethod = rs.data;          
        } else {          
        }
      }),
      catchError(err => {
        return of(undefined);
      })
    ).subscribe();
  }

  //-----------------------UPDATE-------------------------
  filterDataByTrainingProgramId(id: any): void {
    if (id) {
      const majorDetailUni = this.data.majorDetailUnies.find(rs => rs.trainingProgramId === id)
      this.setData(majorDetailUni);
    }    
  }

  initUpdateFormMajor(): void {
    this.updateMajorForm = this._fb.group({
      'majorDetailId': [0],
      'majorCode': [''],
      'totalAdmissionQuantity': ['', Validators.min(1)],
      'status': [1],
      'updatingUniSubAdmissionParams': this._fb.array([])
    })
  }

  setData(data: MajorDetailUniversity): void {
    this.updateMajorForm.get('majorDetailId').setValue(data.id);
    this.updateMajorForm.get('majorCode').setValue(data.majorDetailCode);
    this.updateMajorForm.get('totalAdmissionQuantity').setValue(data.admissionQuantity);
    this.removeFormArray(this.updatingUniSubAdmissionParams);
    this.tmpUpdatingUniSubAdmissionParams = [];
    this.tmpSubjectGroup = [];
    this.handleTmpSubjectGroup
    if (data.majorDetailSubAdmissions !== null) {
      data.majorDetailSubAdmissions.forEach(e => {
        const majorDetailEntryMarkParams = this._fb.array([]);
        if (e.majorDetailEntryMarks !== null) {
          e.majorDetailEntryMarks.forEach(el => {
            const formGroupEntryMark = this._fb.group({
              'entryMarkId': [el.id],
              'mark': [el.mark],
              'majorSubjectGroupId': [this.listOfMajorSubjectGroup.find(rs => rs.id === el.majorSubjectGoupId), Validators.required],
              'status': [1]
            });
            formGroupEntryMark['isUpdate'] = true;
            majorDetailEntryMarkParams.push(formGroupEntryMark)
          });
        };
        const field = this._fb.group({
          'subAdmissionId': [e.id],
          'status': [1],
          'quantity': [e.quantity, Validators.min(1)],
          'genderId': [e.genderId === null ? 1000 : e.genderId],
          'admissionMethodId': [e.admissionMethodId],
          'provinceId': [e.provinceId === null ? this.nation : this.listOfProvince.find(rs => rs.id === e.provinceId), Validators.required],
          'majorDetailEntryMarkParams': majorDetailEntryMarkParams
        });
        field['isUpdate'] = true;        
        this.updatingUniSubAdmissionParams.push(field);
      });
    }
  };

  addSubAddmissionsParams(): void {
    this.updatingUniSubAdmissionParams.push(
      this._fb.group({
        'subAdmissionId': [0],
        'quantity': ['', Validators.min(1)],
        'genderId': [1000],
        'admissionMethodId': [1],
        'provinceId': [this.nation, Validators.required],
        'status': [1],
        'majorDetailEntryMarkParams': this._fb.array([
          this._fb.group({
            'entryMarkId': [0],
            'mark': [''],
            'majorSubjectGroupId': [undefined, Validators.required],
            'status': [1]
          })
        ])
      })
    );
  };

  removeSubAddmissionsParams(index: number) {
    if (!this.updatingUniSubAdmissionParams.controls[index]['isUpdate']) {
      this.updatingUniSubAdmissionParams.removeAt(index);
      return;
    }; if (!this.updatingUniSubAdmissionParams.controls[index].value) {
      return;
    };
    Swal.fire({
      title: 'LƯU Ý',
      text: "Dữ liệu sẽ không quay lại trạng thái ban đầu!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'HỦY',
      confirmButtonText: 'XÁC NHẬN'
    }).then((result) => {
      if (result.isConfirmed) {
        const subAddmissionValue = this.updatingUniSubAdmissionParams.controls[index].value;
        const tmpSubAdmission = { ...subAddmissionValue, 'status': 0, }
        this.handleUpdatingUniSubAdmissionParams.push(tmpSubAdmission);
        this.updatingUniSubAdmissionParams.removeAt(index);
      }
    });
  }

  addSubjectGroupUpdating(submissionIndex: number, data?: any, flag?: number): void {
    const subAddmission = this.updatingUniSubAdmissionParams.controls[submissionIndex];
    const subjectGroup = subAddmission.get('majorDetailEntryMarkParams') as FormArray;
    const field = this._fb.group({
      'entryMarkId': [null],
      'mark': [0],
      'majorSubjectGroupId': [data, Validators.required],
      'status': [1],
    });
    subjectGroup.push(field);
  }  

  removeSubjectGroupUpdating(submissionIndex: number, subjectGroupIndex: number) {
    const subAddmission = this.updatingUniSubAdmissionParams.controls[submissionIndex];
    const subjectGroup = subAddmission.get('majorDetailEntryMarkParams') as FormArray;
    if (!subjectGroup.controls[subjectGroupIndex]['isUpdate']) {
      subjectGroup.removeAt(subjectGroupIndex);
      return;
    };
    if (!subjectGroup.controls[subjectGroupIndex].value) {
      return;
    };
    if (!this.updatingUniSubAdmissionParams.controls[submissionIndex]) {
      return;
    };
    Swal.fire({
      title: 'BẠN CÓ CHẮC?',
      text: "Dữ liệu sẽ không quay lại trạng thái ban đầu!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'HỦY',
      confirmButtonText: 'XÁC NHẬN'
    }).then((result) => {
      if (result.isConfirmed) {
        const subjectGroupValue = { ...subjectGroup.controls[subjectGroupIndex].value, 'majorSubjectGroupId': subjectGroup.controls[subjectGroupIndex].value.majorSubjectGroupId.id, 'status': 0 };
        subjectGroupValue['subAdmissionId'] = this.updatingUniSubAdmissionParams.controls[submissionIndex].value.subAdmissionId
        this.handleTmpSubjectGroup.push(subjectGroupValue);
        subjectGroup.removeAt(subjectGroupIndex);
      }
    })
  }

  updateMajor(): void {
    this.isLoadingUpdate = true;
    const tmpUpdatingUniSubAdmissionParams = this.updatingUniSubAdmissionParams.controls.map(rs => rs.value).concat(this.handleUpdatingUniSubAdmissionParams);    
    const subAddmission = tmpUpdatingUniSubAdmissionParams.map(rs => {
      const sjGroups = this.handleTmpSubjectGroup !== [] ? this.handleTmpSubjectGroup.filter(_ => _.subAdmissionId === rs.subAdmissionId).map(__ => {
        const eachSjGroup = { 'entryMarkId': __.entryMarkId, 'mark': __.mark, 'majorSubjectGroupId': __.majorSubjectGroupId, 'status': __.status }
        return eachSjGroup;
      }) as subjectGroupTmp[] : [];                 
      const tmpMajorDetailEntryMarkParams = rs.majorDetailEntryMarkParams.map(rss => {
        const tmp = { ...rss, 'majorSubjectGroupId': rss.majorSubjectGroupId.id }
        return tmp;
      }) as subjectGroupTmp[]
      const newList = (tmpMajorDetailEntryMarkParams.map(rs => {                      
        const tmp = rs.majorSubjectGroupId === sjGroups.find(rss => rss.majorSubjectGroupId === rs.majorSubjectGroupId)?.majorSubjectGroupId 
        ? {'entryMarkId': sjGroups.find(id => id.majorSubjectGroupId === rs.majorSubjectGroupId)?.entryMarkId, 'mark': rs.mark, 'majorSubjectGroupId': rs.majorSubjectGroupId, 'status': 1} 
        : {'entryMarkId': rs.entryMarkId, 'mark': rs.mark, 'majorSubjectGroupId': rs.majorSubjectGroupId, 'status': 1}        
        return tmp;
      }) as subjectGroupTmp[]).concat(sjGroups.filter(rs => rs.majorSubjectGroupId !== tmpMajorDetailEntryMarkParams.find(rss => rss.majorSubjectGroupId === rs.majorSubjectGroupId)?.majorSubjectGroupId));                 
      const tmp = { ...rs, 'genderId': rs.genderId !== 1000 ? rs.genderId : null, 'provinceId': rs.provinceId.id !== 1000 ? rs.provinceId.id : null, 'majorDetailEntryMarkParams': newList }
      return tmp;
    });
    const newValue = { ...this.updateMajorForm.value, updatingUniSubAdmissionParams: subAddmission };      
    this._universityService.majorUpdation(newValue).pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoadingUpdate = false;
          Swal.fire({ position: 'center', icon: 'success', title: 'Thành Công', showConfirmButton: false, timer: 1500 });
          this.changeSeasonId(this.data.majorDetailUnies[0].seasonId);   
          this.closeModal();
        } else {
          this.isLoadingUpdate = false;
          Swal.fire({ position: 'center', icon: 'error', title: 'Thất Bại', text: rs.errors[0], showConfirmButton: false, timer: 1500 });
        }
      }),
      catchError(err => {        
        return of(undefined);
      })
    ).subscribe();
  }

  getMajorSubjectGroup(majorId: number): void {
    if (this.data !== undefined) {
      this._universityService.majorSubjectGroup(majorId).pipe(
        tap(rs => {
          this.listOfMajorSubjectGroup = rs.data
          if (this.listOfMajorSubjectGroup !== undefined) {
            this.setData(this.data.majorDetailUnies[0])
          }
        })
      ).subscribe();
      this.subjectGroupResult = this._universityService.majorSubjectGroup(majorId).pipe();
      this.listOfDisplaySubjectGroup = this.subjectGroupResult.pipe(
        map(rs => {
          const list = (this.updatingUniSubAdmissionParams.controls[0].get('majorDetailEntryMarkParams') as FormArray).controls.filter(e => e['isUpdate']).map(rs => rs.value.majorSubjectGroupId) as MajorSubjectGroup[];
          const a = rs.data.filter(rss => rss.id !== list.find(rsss => rsss.id === rss.id)?.id);          
          return rs.data;
        })
      )
      return;
    }
    this._universityService.majorSubjectGroup(majorId).pipe(
      tap(rs => {
        while (this.getSubAddmissions.controls.length !== 1) {
          this.getSubAddmissions.removeAt(1);
        }
        this.removeFormArray(this.getSubAddmissions.controls[0].get('subjectGroups') as FormArray);
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            for (let i = 0; i < rs.data.length; i++) {
              this.addSubjectGroup(0, rs.data[i])
            }
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'LƯU Ý',
            text: rs.errors[0]
          })
        }
      })
    ).subscribe();
    this.subjectGroupResult = this._universityService.majorSubjectGroup(majorId).pipe();
    this.listOfDisplaySubjectGroup = this.subjectGroupResult.pipe(
      map(rs => rs.data)
    )
  }

  useSelectSubjectGroup(item: MajorSubjectGroup, subAdmissionIndex: number, subjectGroupIndex: number): void {    
    const list = (this.updatingUniSubAdmissionParams.controls[subAdmissionIndex].get('majorDetailEntryMarkParams') as FormArray).controls.filter(e => !e['isUpdate']).map(rs => rs.value.majorSubjectGroupId);    
  }

  selectedSeason(event: number): void {    
    this.getMajorOfUniversityNonePaging(this.universityId, event.toString());       
  }  

  useSelectMajor(item) {    
    this.majorName = item;
    this.getMajorSubjectGroup(item.id);
    this.majorForm.get('majorCode').setValue(item?.code);
    const a = this.listOfMajors?.find(rs => rs.majorId === item.id) !== undefined ? this.listOfMajors.find(rs => rs.majorId === item.id).majorDetailUnies.map(rs => rs.trainingProgramId) : [];    
    this.getListOfTrainingProgram(a as number[]);
  };

  closeModal(): void {  
    this._modalRef.close();          
  }

  openAddMajorToSystemModal(event: any): void {    
    this.closeModal();
    this.openMajorConfigurationModal(undefined);
  }

  openMajorConfigurationModal(data: MajorConfiguration | undefined): void {    
    if (data === undefined) { 
      const modal = this._modalService.create({
        nzContent: MajorConfigurationModalComponent,
        nzClosable: false,
        nzFooter: null,
        nzWidth: data !== undefined ? 600 : 600,
        nzComponentParams: { data: data, callPlace: 'action-major-modal'},
      });
      modal.afterClose.pipe(
        tap((rs) => {
        })
      ).subscribe();
    }      

  }
}

