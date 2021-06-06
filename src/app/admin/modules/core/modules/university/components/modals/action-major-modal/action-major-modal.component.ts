import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdmissionMethodService, MajorService, SubjectGroupService, TrainingProgramService, UniversityService } from 'src/app/admin/services';
import { MajorDetailUniversity, MajorSubjectGroup, MajorUniversity, Province } from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action-major-modal',
  templateUrl: './action-major-modal.component.html',
  styleUrls: ['./action-major-modal.component.scss']
})
export class ActionMajorModalComponent implements OnInit, OnChanges {

  @Input() data: MajorUniversity | undefined;
  @Input() listOfMajor: MajorUniversity[] = []
  @Input() universityName: string;
  @Input() universityId: any;
  @Input() callBack: (id: number) => void;
  @Input() callBack2: (pageNumber: number, pageSize: number, uniId: string, seasonId: number, majorName: string) => void;
  @Input() test: (a: string) => void;

  @Output() seasonId = new EventEmitter<any>();

  modalTitle: string = 'Thêm ngành của ';

  majorForm: FormGroup;
  updateMajorForm: FormGroup;

  majorResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);
  listOfDisplayMajorResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);
  subjectGroupResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);
  trainingProgramResult: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);


  provinceResult: Observable<Province[]> = new BehaviorSubject<Province[]>({} as Province[]);


  listOfDisplaySubjectGroup: Observable<Response<any>> = new BehaviorSubject<Response<any>>({} as Response<any>);

  tmpUpdatingUniSubAdmissionParams: any[] = [];
  get handleUpdatingUniSubAdmissionParams(): any[] {
    return this.tmpUpdatingUniSubAdmissionParams;
  };



  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _majorService: MajorService,
    private _subjectGroupService: SubjectGroupService,
    private _notification: NzNotificationService,
    private _trainingProgramService: TrainingProgramService,
    private _addmissionMethodService: AdmissionMethodService,
    private _universityService: UniversityService
  ) {
    this.initMajorForm();
    this.initUpdateFormMajor();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.callBack);
  }

  ngOnInit() {
    this.getListOfMajor();
    this.getListOfTrainingProgram([]);
    this.getProvince();
    console.log(this.data);
    if (this.data === undefined) {
      this.modalTitle = 'THÊM NGÀNH CỦA ' + `${this.universityName.toUpperCase()}`;
    }

  }

  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'majorId': [undefined, Validators.required],
      'majorCode': [''],
      'trainingProgramId': [undefined, Validators.required],
      'totalAdmissionQuantity': [0, Validators.required],
      'seasonId': [9, Validators.required],
      'subAdmissions': this._fb.array([
        this._fb.group({
          'genderId': [1000, Validators.required],
          'admissionMethodId': [1, Validators.required],
          'provinceId': [this.nation, Validators.required],
          'quantity': [0, Validators.required],
          'subjectGroups': this._fb.array([
            // this._fb.group({
            //   "majorSubjectGroupId": [undefined, Validators.required],
            //   "entryMarkPerGroup": [0, Validators.required]
            // }),
          ]),
        }),
      ]),
    });
  };

  addMajor(): void {
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
    console.log(newValue)
    this._universityService.majorAddition(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          Swal.fire({ position: 'center', icon: 'success', title: 'Thành Công', showConfirmButton: false, timer: 1500 });
          this.closeModal();
        }
      })
    ).subscribe();
    // console.log(this.majorForm.get('seasonId').value, 'seasonId') 
    // this.callBack2(1, 10, this.universityId, 9, '');
    // const a = parseInt(this.majorForm.get('seasonId').value);
    // if (a === 9) {
    //   this.callBack(9);
    // } 
    // if (a === 1) {
    //   this.callBack(1);
    // }                
  }



  get getSubAddmissions(): FormArray {
    return this.majorForm.get('subAdmissions') as FormArray
  }

  get updatingUniSubAdmissionParams(): FormArray {
    return this.updateMajorForm.get('updatingUniSubAdmissionParams') as FormArray
  }


  subjectGroups(index: number): FormArray {
    const subAddmissions = this.majorForm.get('subAddmissions') as FormArray
    return subAddmissions.controls[index].get('subjectGroups') as FormArray
  }

  addSubAddmissions(): void {
    this.getSubAddmissions.push(
      this._fb.group({
        'genderId': [1000, Validators.required],
        'admissionMethodId': [1, Validators.required],
        'provinceId': [this.nation, Validators.required],
        'quantity': [0, Validators.required],
        'subjectGroups': this._fb.array([
          this._fb.group({
            "majorSubjectGroupId": [undefined, Validators.required],
            "entryMarkPerGroup": [0, Validators.required]
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
        "entryMarkPerGroup": [0, Validators.required]
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

  listOfMajorSubjectGroup: MajorSubjectGroup[];
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
        map(rs => rs.data)
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
            title: 'ahaha',
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

  useSelectMajor(item) {
    console.log(item);
    this.getMajorSubjectGroup(item.id);
    this.majorForm.get('majorCode').setValue(item?.code);
    console.log(this.listOfMajor, 'list major');
    const a = this.listOfMajor?.find(rs => rs.majorId === item.id) !== undefined ? this.listOfMajor.find(rs => rs.majorId === item.id).majorDetailUnies.map(rs => rs.trainingProgramId) : [];
    console.log(a);
    this.getListOfTrainingProgram(a as number[]);
  };

  listOfProvince: Province[];
  getProvince(): void {
    this._addmissionMethodService.getProvince().pipe(
      tap(rs => {
        console.log(rs)
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
      map(rs => {
        const all = this.nation as Province
        const province = [...rs.data, all]
        return [this.nation].concat(rs.data);
      })
    )
  }
  getListOfMajor(): void {
    this.majorResult = this._majorService.getAllMajor().pipe();
    this.listOfDisplayMajorResult = this.majorResult.pipe(
      map((rs) =>
        rs.data
      ),
    )
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
        // console.log(rs);
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
    console.log(id);
  }

  nation = environment.nation;

  initUpdateFormMajor(): void {
    this.updateMajorForm = this._fb.group({
      'majorDetailId': [0],
      'majorCode': [''],
      'totalAdmissionQuantity': [0, Validators.required],
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
              'mark': [el.mark, Validators.required],
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
          'quantity': [e.quantity, Validators.required],
          'genderId': [e.genderId === null ? 1000 : e.genderId],
          'admissionMethodId': [e.admissionMethodId],
          'provinceId': [e.provinceId === null ? this.nation : this.listOfProvince.find(rs => rs.id === e.provinceId), Validators.required],
          'majorDetailEntryMarkParams': majorDetailEntryMarkParams
        });
        field['isUpdate'] = true;
        console.log(field);
        this.updatingUniSubAdmissionParams.push(field);
      });
    }
  };

  addSubAddmissionsParams(): void {
    this.updatingUniSubAdmissionParams.push(
      this._fb.group({
        'subAdmissionId': [0],
        'quantity': [0, Validators.required],
        'genderId': [1000],
        'admissionMethodId': [1],
        'provinceId': [this.nation, Validators.required],
        'status': [1],
        'majorDetailEntryMarkParams': this._fb.array([
          this._fb.group({
            'entryMarkId': [0],
            'mark': [0, Validators.required],
            'majorSubjectGroupId': [undefined, Validators.required],
            'status': [1]
          })
        ])
      })
    )
  };  

  removeSubAddmissionsParams(index: number) {
    if (!this.updatingUniSubAdmissionParams.controls[index]['isUpdate']) {
      this.updatingUniSubAdmissionParams.removeAt(index);
      return;
    } if (!this.updatingUniSubAdmissionParams.controls[index].value) {
      return;
    }
    const subAddmissionValue = this.updatingUniSubAdmissionParams.controls[index].value;
    const tmpSubAdmission = { ...subAddmissionValue, 'status': 0, }
    this.handleUpdatingUniSubAdmissionParams.push(tmpSubAdmission);
    console.log(this.handleUpdatingUniSubAdmissionParams);
    this.updatingUniSubAdmissionParams.removeAt(index);
  }

  addSubjectGroupUpdating(submissionIndex: number, data?: any, flag?: number): void {
    console.log('alsdkjglksd');
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


  tmpSubjectGroup: any[] = [];
  get handleTmpSubjectGroup(): any[] {
    return this.tmpSubjectGroup;
  }
  removeSubjectGroupUpdating(submissionIndex: number, subjectGroupIndex: number) {
    const subAddmission = this.updatingUniSubAdmissionParams.controls[submissionIndex];
    const subjectGroup = subAddmission.get('majorDetailEntryMarkParams') as FormArray;
    if (!subjectGroup.controls[subjectGroupIndex]['isUpdate']) {
      subjectGroup.removeAt(subjectGroupIndex);
      return;
    }
    if (!subjectGroup.controls[subjectGroupIndex].value) {
      return;
    }
    if (!this.updatingUniSubAdmissionParams.controls[submissionIndex]) {
      return;
    }
    const subjectGroupValue = { ...subjectGroup.controls[subjectGroupIndex].value, 'majorSubjectGroupId': subjectGroup.controls[subjectGroupIndex].value.majorSubjectGroupId.id, 'status': 0 };
    subjectGroupValue['subAdmissionId'] = this.updatingUniSubAdmissionParams.controls[submissionIndex].value.subAdmissionId

    this.handleTmpSubjectGroup.push(subjectGroupValue);
    subjectGroup.removeAt(subjectGroupIndex);
  }

  updateMajor(): void {
    const tmpUpdatingUniSubAdmissionParams = this.updatingUniSubAdmissionParams.controls.map(rs => rs.value).concat(this.handleUpdatingUniSubAdmissionParams);
    const subAddmission = tmpUpdatingUniSubAdmissionParams.map(rs => {
      const sjGroups = this.handleTmpSubjectGroup !== [] ? this.handleTmpSubjectGroup.filter(_ => _.subAdmissionId === rs.subAdmissionId).map(__ => {
        const eachSjGroup = { 'entryMarkId': __.entryMarkId, 'mark': __.mark, 'majorSubjectGroupId': __.majorSubjectGroupId, 'status': __.status }
        return eachSjGroup;
      }) : [];
      const tmpMajorDetailEntryMarkParams = rs.majorDetailEntryMarkParams.map(rss => {
        const tmp = { ...rss, 'majorSubjectGroupId': rss.majorSubjectGroupId.id }
        return tmp;
      }).concat(sjGroups)
      const tmp = { ...rs, 'genderId': rs.genderId !== 1000 ? rs.genderId : null, 'provinceId': rs.provinceId.id !== 1000 ? rs.provinceId.id : null, 'majorDetailEntryMarkParams': tmpMajorDetailEntryMarkParams }
      return tmp;
    });
    const newValue = { ...this.updateMajorForm.value, updatingUniSubAdmissionParams: subAddmission };
    console.log(newValue);
    this._universityService.majorUpdation(newValue).pipe(
      tap(rs => {
        console.log(rs)
        this.closeModal();
      }),
      catchError(err => {
        console.log(err);
        return of(undefined);
      })
    ).subscribe();
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
