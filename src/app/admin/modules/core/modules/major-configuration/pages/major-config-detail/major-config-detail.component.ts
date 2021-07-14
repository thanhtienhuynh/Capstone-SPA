import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { MajorConfigurationService, SubjectGroupService, SubjectService } from 'src/app/admin/services';
import { MajorConfiguration, Subject, SubjectGroupVM } from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-major-config-detail',
  templateUrl: './major-config-detail.component.html',
  styleUrls: ['./major-config-detail.component.scss']
})
export class MajorConfigDetailComponent implements OnInit {

  subjectGroupResult: Observable<Response<SubjectGroupVM[]>> = new BehaviorSubject<Response<SubjectGroupVM[]>>({} as Response<SubjectGroupVM[]>);
  listOfDisplaySubjectGroup: Observable<SubjectGroupVM[]> = new BehaviorSubject<SubjectGroupVM[]>({} as SubjectGroupVM[]);
  constructor(
    private _subjectService: SubjectService,
    private _subjectGroupService: SubjectGroupService,
    private _majorConfigService: MajorConfigurationService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder
  ) {
    this.initMajorForm();
  }

  editorOptions = quillConfiguration;
  majorId: number;
  majorForm: FormGroup;
  majorDetail: MajorConfiguration;

  ngOnInit() {
    this.getListOfSubjectGroup();
    this._activatedRoute.params.subscribe((param) => {
      this.majorId = param?.id;
      this.getMajorById(this.majorId);
    });
  }

  getListOfSubjectGroup(): void {
    this.subjectGroupResult = this._subjectGroupService.getAllSubjectGroup().pipe();
    this.listOfDisplaySubjectGroup = this.subjectGroupResult.pipe(
      map(rs => rs.data)
    )
  }

  getMajorById(id: number): void {
    this._majorConfigService.getMajorById(id).pipe(
      tap(rs => {
        console.log(rs.data);
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.majorDetail = rs.data;
            this.setDataToMajorForm(rs.data);
          }
        }
      })
    ).subscribe();
  }

  getMajorFormControls(controlName: string): void {
    switch (controlName) {
      case 'code':
        console.log('đây là code')
        this.majorForm.get('code')['isUpdateHtml'] = false;
        break;
      case 'description':
        console.log('đây là description')
        this.majorForm.get('description')['isUpdateHtml'] = false;
        break;
      case 'curriculum':
        this.majorForm.get('curriculum')['isUpdateHtml'] = false;
        break;
      case 'humanQuality':
        this.majorForm.get('humanQuality')['isUpdateHtml'] = false;
        break;
      case 'salaryDescription':
        this.majorForm.get('salaryDescription')['isUpdateHtml'] = false;
        break;
      default:
        break;
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
      // 'subjectGroup': this._fb.group({
      //   'id': [''],
      //   'subjectWeights': this._fb.array([])
      // }),
      'subjectGroup': this._fb.array([]),
      'status': [1],
    });
    this.majorForm.get('code')['isUpdateHtml'] = true
    this.majorForm.get('description')['isUpdateHtml'] = true
    this.majorForm.get('humanQuality')['isUpdateHtml'] = true
    this.majorForm.get('curriculum')['isUpdateHtml'] = true
    this.majorForm.get('salaryDescription')['isUpdateHtml'] = true
  }
  get getSubjectGroups(): FormArray {
    return this.majorForm.get('subjectGroup') as FormArray
  }

  get subjectWeightsUpdating(): FormArray {
    return (this.majorForm.get('subjectGroup') as FormGroup).controls.subjectWeights as FormArray
  }
  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  setDataToMajorForm(data: MajorConfiguration): void {
    this.majorForm.get('id').setValue(data.id);
    this.majorForm.get('name').setValue(data.name);
    this.majorForm.get('code').setValue(data.code);
    this.majorForm.get('description').setValue(data.description);
    this.majorForm.get('curriculum').setValue(data.curriculum);
    this.majorForm.get('humanQuality').setValue(data.humanQuality);
    this.majorForm.get('salaryDescription').setValue(data.salaryDescription);
    this.removeFormArray(this.getSubjectGroups);
    if (data.subjectGroups !== null) {
      data.subjectGroups.forEach(e => {
        const subjectWeights = this._fb.array([]);
        if (e.subjectWeights !== null) {
          e.subjectWeights.forEach(el => {
            const subjectWeightsField = this._fb.group({
              'subjectId': [{ subjectId: el.id, subjectName: el.name }],
              'weight': [el.weight],
              'isSpecialSubjectGroup': [el.isSpecialSubjectGroup]
            })
            subjectWeightsField['isUpdate'] = true;
            subjectWeights.push(subjectWeightsField);
          });
        }
        const subjectGroupfield = this._fb.group({
          'id': [{ id: e.id, groupCode: e.groupCode }],
          'status': [1],
          'subjectWeights': subjectWeights
        });
        subjectGroupfield['isUpdate'] = true;
        this.getSubjectGroups.push(subjectGroupfield);
      });
    }
    console.log(this.getSubjectGroups);
    // (this.majorForm.get('subjectGroup') as FormGroup).controls.id.setValue(data.subjectGroups[index].id);
    // this.removeFormArray(this.subjectWeightsUpdating);
    // for (let i = 0; i < data.subjectGroups[index].subjectWeights.length; i++) {
    //   const element = data.subjectGroups[index].subjectWeights[i];
    //   this.subjectWeightsUpdating.push(
    //     this._fb.group({
    //       'subjectId': [{ subjectId: element.id, subjectName: element.name }],
    //       'weight': [element.weight, Validators.required],
    //       'isSpecialSubjectGroup': [element.isSpecialSubjectGroup]
    //     })
    //   )
    // }
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

  tmpSubjetGroupParam: any[] = [];

  get handleSubjecGroupParam(): any[] {
    return this.tmpSubjetGroupParam;
  }
  removeSubjectGroup(index: number): void {
    const subjectName = this.getSubjectGroups.controls[index].get('id').value?.groupCode;
    if (this.getSubjectGroups.controls[index]['isUpdate'] !== true) {
      this.getSubjectGroups.removeAt(index);
      return;
    }
    Swal.fire({
      title: 'LƯU Ý',
      html: `Bạn đang thực hiện thao tác xóa khối <b><i>${subjectName}</i></b>, ngành <b><i>${this.majorDetail.name}</i></b> ra khỏi hệ thống, Dữ liệu sẽ không thể khôi phục giống trạng thái ban đầu. Bạn có muốn tiếp tục không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'BỎ QUA',
      confirmButtonText: 'XÁC NHẬN'
    }).then((result) => {
      if (result.isConfirmed) {
        const subjectGroupValue = this.getSubjectGroups.controls[index].value;
        const tmpSubjectGroupValue = { ...subjectGroupValue, 'status': 0 };
        this.handleSubjecGroupParam.push(tmpSubjectGroupValue);
        this.getSubjectGroups.removeAt(index);
      }
    });
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

  updateMajorToSystem(): void {
    const subjectGroupValue = this.getSubjectGroups.controls.map(rs => rs.value).concat(this.handleSubjecGroupParam).map(rs => {
      const subjectWeightValue = rs?.subjectWeights?.map(_ => {
        const tmp = { ..._, subjectId: _?.subjectId?.subjectId }
        return tmp;
      })
      const tmp = { ...rs, id: rs?.id?.id, subjectWeights: subjectWeightValue }
      return tmp;
    });
    const description = (this.majorForm.get('description').value === '<h2 class=\"ql-align-justify\"><br></h2>' || this.majorForm.get('description').value === '') ? null : this.majorForm.get('description').value;
    const curriculum = (this.majorForm.get('curriculum').value === '<h2 class=\"ql-align-justify\"><br></h2>' || this.majorForm.get('curriculum').value === '') ? null : this.majorForm.get('curriculum').value;
    const humanQuality = (this.majorForm.get('humanQuality').value === '<h2 class=\"ql-align-justify\"><br></h2>' || this.majorForm.get('humanQuality').value === '') ? null : this.majorForm.get('humanQuality').value;
    const salaryDescription = (this.majorForm.get('salaryDescription').value === '<h2 class=\"ql-align-justify\"><br></h2>' || this.majorForm.get('salaryDescription').value === '') ? null : this.majorForm.get('salaryDescription').value;
    const newValue = { ...this.majorForm.value, curriculum: curriculum, humanQuality: humanQuality, salaryDescription: salaryDescription, description: description, subjectGroup: subjectGroupValue }
    console.log(newValue);
    this._majorConfigService.updateMajorToSystem(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'THÀNH CÔNG',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
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

  saveData(controlName: string): void {
    switch (controlName) {
      case 'code':
        this.majorForm.get('code')["isUpdateHtml"] = true
        break;
      case 'description':
        this.majorForm.get('description')["isUpdateHtml"] = true
        break;
      case 'curriculum':
        this.majorForm.get('curriculum')["isUpdateHtml"] = true
        break;
      case 'humanQuality':
        this.majorForm.get('humanQuality')["isUpdateHtml"] = true
        break;
      case 'salaryDescription':
        this.majorForm.get('salaryDescription')["isUpdateHtml"] = true
        break;

      default:
        break;
    }
  }

  cancelData(controlName: string): void {
    switch (controlName) {
      case 'code':
        if (this.majorForm.get('code').value === this.majorDetail.code) {
          console.log('ddungs')
          this.majorForm.get('code')['isUpdateHtml'] = true;
        } else {
          Swal.fire({
            title: 'LƯU Ý',
            html: `Toàn bộ nội dung bạn vừa thay đổi sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Thoát',
            confirmButtonText: 'Xác nhận'
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('code')['isUpdateHtml'] = true;
              this.majorForm.get('code').patchValue(this.majorDetail.code);
            }
          });
        }
        break;
      case 'description':
        if (this.majorForm.get('description').value === this.majorDetail.description) {
          this.majorForm.get('description')['isUpdateHtml'] = true;
        } else {
          Swal.fire({
            title: 'LƯU Ý',
            html: `Toàn bộ nội dung bạn vừa thay đổi sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Thoát',
            confirmButtonText: 'Xác nhận'
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('description')['isUpdateHtml'] = true;
              this.majorForm.get('description').patchValue(this.majorDetail.description);
            }
          });
        }
        break;
      case 'curriculum':
        if (this.majorForm.get('curriculum').value === this.majorDetail.curriculum) {
          this.majorForm.get('curriculum')['isUpdateHtml'] = true;
        } else {
          Swal.fire({
            title: 'LƯU Ý',
            html: `Toàn bộ nội dung bạn vừa thay đổi sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Thoát',
            confirmButtonText: 'Xác nhận'
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('curriculum')['isUpdateHtml'] = true;
              this.majorForm.get('curriculum').patchValue(this.majorDetail.curriculum);
            }
          });
        }
        break;
      case 'humanQuality':
        if (this.majorForm.get('humanQuality').value === this.majorDetail.humanQuality) {
          this.majorForm.get('humanQuality')['isUpdateHtml'] = true;
        } else {
          Swal.fire({
            title: 'LƯU Ý',
            html: `Toàn bộ nội dung bạn vừa thay đổi sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Thoát',
            confirmButtonText: 'Xác nhận'
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('humanQuality')['isUpdateHtml'] = true;
              this.majorForm.get('humanQuality').patchValue(this.majorDetail.humanQuality);
            }
          });
        }
        break;
      case 'salaryDescription':
        if (this.majorForm.get('salaryDescription').value === this.majorDetail.salaryDescription) {
          this.majorForm.get('salaryDescription')['isUpdateHtml'] = true;
        } else {
          Swal.fire({
            title: 'LƯU Ý',
            html: `Toàn bộ nội dung bạn vừa thay đổi sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Thoát',
            confirmButtonText: 'Xác nhận'
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('salaryDescription')['isUpdateHtml'] = true;
              this.majorForm.get('salaryDescription').patchValue(this.majorDetail.salaryDescription);
            }
          });
        }
        break;

      default:
        break;
    }
  }
}
