import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MajorConfigurationService, SubjectGroupService, SubjectService } from 'src/app/admin/services';
import { MajorConfiguration, Subject, SubjectGroupVM, SubjectPerSubjectGroup, SubjectWeight, SubjetGroup } from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-major-configuration-modal',
  templateUrl: './major-configuration-modal.component.html',
  styleUrls: ['./major-configuration-modal.component.scss']
})
export class MajorConfigurationModalComponent implements OnInit {

  @Input() data: MajorConfiguration | undefined;
  @Input() callBack: (pageNumber: number, pageSize: number, majorName: string) => void;
  @Input() callPlace: any;

  additionLoading: boolean = false;
  updationLoading: boolean = false;
  deletetionLoading: boolean = false;
  majorForm: FormGroup;
  subjectWeightForm: FormArray;
  addMajorForm: FormGroup;
  listOfSubject: Subject[];

  subjectGroupResult: Observable<Response<SubjectGroupVM[]>> = new BehaviorSubject<Response<SubjectGroupVM[]>>({} as Response<SubjectGroupVM[]>);
  listOfDisplaySubjectGroup: Observable<SubjectGroupVM[]> = new BehaviorSubject<SubjectGroupVM[]>({} as SubjectGroupVM[]);

  constructor(
    private _modalRef: NzModalRef,
    private _modalService: NzModalService,
    private _subjectService: SubjectService,
    private _subjectGroupService: SubjectGroupService,
    private _majorConfigService: MajorConfigurationService,
    private _fb: FormBuilder
  ) {
    this.initAddForm();
    this.initMajorForm();
    this.initSubjectWeightForm();
  }

  ngOnInit() {
    this.getListSubject();
    this.getListOfSubjectGroup();
    console.log(this.data);
    if (this.data !== undefined) {
      this.setDataToMajorForm(this.data, 0);
      this.setDataToSubjectWeightForm(this.data.subjectGroups[0].subjectWeights);
    }
  }

  getListOfSubjectGroup(): void {
    this.subjectGroupResult = this._subjectGroupService.getAllSubjectGroup().pipe();
    this.listOfDisplaySubjectGroup = this.subjectGroupResult.pipe(
      map(rs => rs.data)
    )
  }

  initAddForm(): void {
    this.addMajorForm = this._fb.group({
      'name': ['', Validators.required],
      'code': ['', Validators.required],
      'subjectGroups': this._fb.array([
        this._fb.group({
          'id': [undefined],
          'subjectWeights': this._fb.array([])
        })
      ])
    })
  }

  get getSubjectGroups(): FormArray {
    return this.addMajorForm.get('subjectGroups') as FormArray
  }

  addNewMajorToSystem(): void {
    this.additionLoading = true;
    const subjectGroupsValues = this.getSubjectGroups.controls.map(rs => rs.value);
    const subjectGroups = subjectGroupsValues.map(rs => {
      const subjectWeightTmp = rs?.subjectWeights.map(rss => {
        const tmp = { ...rss, subjectId: rss.subjectId?.subjectId };
        return tmp;
      })
      const tmp = { ...rs, id: rs.id?.id, subjectWeights: subjectWeightTmp };
      return tmp
    });
    const newValue = { ...this.addMajorForm.value, subjectGroups: subjectGroups }
    this._majorConfigService.addNewMajorToSystem(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.additionLoading = false;
          Swal.fire('Thành Công', 'Thêm mới ngành vào hệ thống thành công', 'success');
          if (!this.callPlace) {
            this.callBack(1, 10, this.addMajorForm.get('name').value);
          }
          this.closeModal();
        } else {
          this.additionLoading = false;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }

  addSubjectGroup(): void {
    this.getSubjectGroups.push(
      this._fb.group({
        'id': [undefined],
        'status': [1],
        'subjectWeights': this._fb.array([])
      })
    );
  }

  removeSubjectGroup(index: number): void {
    this.getSubjectGroups.removeAt(index);
  }

  addSubjectWeights(index: number, data: Subject[]): void {
    const subjectGroup = this.getSubjectGroups.controls[index];
    const subjectWeights = subjectGroup.get('subjectWeights') as FormArray;
    this.removeFormArray(subjectWeights);
    for (let i = 0; i < data.length; i++) {
      const tmp = { subjectId: data[i].id, subjectName: data[i].name }
      subjectWeights.push(
        this._fb.group({
          'subjectId': [tmp],
          'weight': [1, Validators.required],
          'isSpecialSubjectGroup': [data[i].isSpecialSubjectGroup]
        })
      );
    }
  }

  initMajorForm(): void {
    this.majorForm = this._fb.group({
      'id': [''],
      'name': [''],
      'code': ['', Validators.required],
      'description': [''],
      'curriculum': [''],
      'humanQuality': [''],
      'salaryDescription': [''],
      'subjectGroup': this._fb.group({
        'id': [''],
        'subjectWeights': this._fb.array([])
      }),
      'status': [1],
    });
  }

  updateMajorToSystem(action?: string): void {    
    const subjectWeightValue = this.subjectWeightsUpdating.controls.map(rs => rs.value);
    const subjectWeights = subjectWeightValue.map(rs => {
      const tmp = { ...rs, subjectId: rs?.subjectId?.subjectId }
      return tmp;
    });
    const subjectGroupStatus = action === 'delete' ? 0 : 1;
    const subjectGroups = [{ ...this.majorForm.value.subjectGroup, subjectWeights: subjectWeights, status: subjectGroupStatus }];
    const newValue = { ...this.majorForm.value, subjectGroup: subjectGroups };   
    console.log(newValue);
    if (action === 'delete') {
      this.deletetionLoading = true;
      Swal.fire({
        title: 'CẢNH BÁO',
        html: `Xóa khối, ngành <b><i>${newValue.name}</i></b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'BỎ QUA',
        confirmButtonText: 'XÁC NHẬN'
      }).then((result) => {
        if (result.isConfirmed) {
          this._majorConfigService.updateMajorToSystem(newValue).pipe(
            tap(rs => {
              if (rs.succeeded === true) {
                this.deletetionLoading = false;
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'THÀNH CÔNG',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.callBack(1, 10, this.majorForm.get('name').value);
                this.closeModal();
              } else {
                this.deletetionLoading = false;
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: `${rs.errors[0]}`,
                  showConfirmButton: false,
                  timer: 1500
                });
              }
      
            })
          ).subscribe()
        }
        if(result.isDismissed){
          this.deletetionLoading = false;
        }
      });

    } else {
      this.updationLoading = true;
      this._majorConfigService.updateMajorToSystem(newValue).pipe(
        tap(rs => {
          if (rs.succeeded === true) {
            this.updationLoading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'THAY ĐỔI THÔNG TIN THÀNH CÔNG',
              showConfirmButton: false,
              timer: 1500
            });
            this.callBack(1, 10, this.majorForm.get('name').value);
            this.closeModal();
          } else {
            this.updationLoading = false;
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `${rs.errors[0]}`,
              showConfirmButton: false,
              timer: 1500
            });
          }
  
        })
      ).subscribe()
    }

  }

  initSubjectWeightForm(): void {
    this.subjectWeightForm = this._fb.array([]);
  }


  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  setDataToSubjectWeightForm(data: SubjectWeight[]): void {
    this.removeFormArray(this.subjectWeightForm);
    for (let i = 0; i < data.length; i++) {
      this.subjectWeightForm.push(
        this._fb.group({
          'id': [data[i].id],
          'name': [data[i].name],
          'weight': [data[i].weight, Validators.required],
          'isSpecialSubjectGroup': [data[i].isSpecialSubjectGroup]
        })
      );
    }
  }

  get subjectWeightsUpdating(): FormArray {
    return (this.majorForm.get('subjectGroup') as FormGroup).controls.subjectWeights as FormArray
  }

  setDataToMajorForm(data: MajorConfiguration, index: number): void {
    this.majorForm.get('id').setValue(data.id);
    this.majorForm.get('name').setValue(data.name);
    this.majorForm.get('code').setValue(data.code);
    this.majorForm.get('description').setValue(data.description);
    this.majorForm.get('curriculum').setValue(data.curriculum);
    this.majorForm.get('humanQuality').setValue(data.humanQuality);
    this.majorForm.get('salaryDescription').setValue(data.salaryDescription);
    (this.majorForm.get('subjectGroup') as FormGroup).controls.id.setValue(data.subjectGroups[index].id);
    this.removeFormArray(this.subjectWeightsUpdating);
    for (let i = 0; i < data.subjectGroups[index].subjectWeights.length; i++) {
      const element = data.subjectGroups[index].subjectWeights[i];
      this.subjectWeightsUpdating.push(
        this._fb.group({
          'subjectId': [{ subjectId: element.id, subjectName: element.name }],
          'weight': [element.weight, Validators.required],
          'isSpecialSubjectGroup': [element.isSpecialSubjectGroup]
        })
      )
    }
  }

  getListSubject(): void {
    this._subjectService.getListOfSubject().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.listOfSubject = rs.data;
        } else {

        }
      })
    ).subscribe();
  }

  previousSubjetGroupIndex: number = 0;

  filterDataBySubjectGroup(id: number, data: MajorConfiguration): void {
    console.log(id);
    console.log(data);
    if (this.data === undefined) {
      return;
    }
    Swal.fire({
      title: 'LƯU Ý',
      html: "<p>Dữ liệu trọng số của khối đã thay đổi</p><p>Nếu bạn rời đi, dữ liệu đã thay đổi sẽ biến mất, và quay lại trạng thái ban đầu</p><p>Bạn có muốn rời đi không?</p>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Ở lại',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Rời đi'
    }).then((result) => {
      if (result.isConfirmed) {        
        const subjectGroup = this.data.subjectGroups.find(rs => rs.id === id) as SubjetGroup;
        this.previousSubjetGroupIndex = data.subjectGroups.findIndex(rs => rs.id === subjectGroup.id);        
        (this.majorForm.get('subjectGroup') as FormGroup).controls.id.setValue(subjectGroup.id);        
        this.removeFormArray(this.subjectWeightsUpdating);
        for (let i = 0; i < subjectGroup.subjectWeights.length; i++) {
          const element = subjectGroup.subjectWeights[i];
          this.subjectWeightsUpdating.push(
            this._fb.group({
              'subjectId': [{ subjectId: element.id, subjectName: element.name }],
              'weight': [element.weight, Validators.required],
              'isSpecialSubjectGroup': [element.isSpecialSubjectGroup]
            })
          )
        }
      }
      if (result.isDismissed) {        
        (this.majorForm.get('subjectGroup') as FormGroup).controls.id.setValue(data.subjectGroups[this.previousSubjetGroupIndex].id);                
      }
    })
  }


  closeModal(): void {
    this._modalRef.close();
  }

  getSubjectsPerSubjectGroup(id: number, index: number): void {
    this._subjectGroupService.getSubjectsBySubjectGroupId(id).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.addSubjectWeights(index, rs.data.subjects as Subject[])
          }
        } else {

        }
      })
    ).subscribe();
  }
  useSelectSubjectGroup(data: { id?: number, groupCode?: string }, index: number): void {
    this.getSubjectsPerSubjectGroup(data.id, index);
  }

}
