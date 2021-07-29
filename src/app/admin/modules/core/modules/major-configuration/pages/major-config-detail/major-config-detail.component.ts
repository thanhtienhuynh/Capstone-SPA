import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { MajorConfigurationService, SubjectGroupService, SubjectService } from 'src/app/admin/services';
import { MajorConfiguration, Subject, SubjectGroupVM } from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import Swal from 'sweetalert2';
import { ReviewMajorConfigurationModalComponent } from '../../components';

@Component({
  selector: 'app-major-config-detail',
  templateUrl: './major-config-detail.component.html',
  styleUrls: ['./major-config-detail.component.scss']
})
export class MajorConfigDetailComponent implements OnInit {

  subjectGroupResult: Observable<Response<SubjectGroupVM[]>> = new BehaviorSubject<Response<SubjectGroupVM[]>>({} as Response<SubjectGroupVM[]>);
  listOfDisplaySubjectGroup: Observable<SubjectGroupVM[]> = new BehaviorSubject<SubjectGroupVM[]>({} as SubjectGroupVM[]);
  constructor(    
    private _subjectGroupService: SubjectGroupService,
    private _majorConfigService: MajorConfigurationService,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NzModalService,
    private _fb: FormBuilder
  ) {
    this.initMajorForm();
  }

  editorOptions = quillConfiguration;
  majorId: number;
  majorForm: FormGroup;
  majorDetail: MajorConfiguration;
  majorDetailTmp: MajorConfiguration;

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
            this.majorDetail = { ...rs.data };
            this.setDataToMajorForm(this.majorDetail);
            this.majorDetailTmp = { ...rs.data, subjectGroups: rs.data.subjectGroups.slice() }
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
    this.majorForm.reset();
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
              'weight': [el.weight, Validators.required],
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
  }

  addSubjectGroupToFirstIndex(): void {
    console.log(this.getSubjectGroups.controls.length);
    console.log(this.majorDetail.subjectGroups.length);
    this.majorDetailTmp.subjectGroups.unshift({ id: null, status: 1, subjectWeights: [] });
    const newFbGroup = this._fb.group({
      'id': [undefined],
      'status': [1],
      'subjectWeights': this._fb.array([])
    })
    this.getSubjectGroups.insert(0, newFbGroup);
  }
  addSubjectGroup(): void {
    this.getSubjectGroups.push(
      this._fb.group({
        'id': [undefined],
        'status': [1],
        'subjectWeights': this._fb.array([])
      })
    );
    console.log(this.getSubjectGroups.value);
  }

  resetSubjectGroupDataByIndex(sjIndex: number): void {
    console.log(this.majorDetailTmp.subjectGroups[sjIndex].subjectWeights);
    console.log(this.getSubjectGroups.controls[sjIndex].get('subjectWeights').value);
    if (this.getSubjectGroups.controls[sjIndex]['isUpdate'] !== true) {
      return;
    }
    const subjectWeightsTmp = this.getSubjectGroups.controls[sjIndex].get('subjectWeights') as FormArray;
    this.removeFormArray(subjectWeightsTmp);
    for (let i = 0; i < this.majorDetailTmp.subjectGroups[sjIndex].subjectWeights.length; i++) {
      const element = this.majorDetailTmp.subjectGroups[sjIndex].subjectWeights[i];
      subjectWeightsTmp.push(
        this._fb.group({
          'subjectId': [{ subjectId: element.id, subjectName: element.name }],
          'weight': [element.weight, Validators.required],
          'isSpecialSubjectGroup': [element.isSpecialSubjectGroup]
        })
      )
    }
  }

  tmpSubjetGroupParam: any[] = [];

  get handleSubjecGroupParam(): any[] {
    return this.tmpSubjetGroupParam;
  }
  removeSubjectGroup(index: number): void {
    const subjectName = this.getSubjectGroups.controls[index].get('id').value?.groupCode;
    if (this.getSubjectGroups.controls[index]['isUpdate'] !== true) {
      this.majorDetailTmp.subjectGroups.splice(index, 1);
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
        this.majorDetailTmp.subjectGroups.splice(index, 1);
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
    const newValue = { ...this.majorForm.value, status: 1, curriculum: curriculum, humanQuality: humanQuality, salaryDescription: salaryDescription, description: description, subjectGroup: subjectGroupValue }
    console.log(newValue);
    this.openReviewModal(newValue, this.getSubjectGroups.controls.map(rs => rs.value));
  }


  openReviewModal(data: any, subjectGroups: any): void {
    const modal = this._modalService.create({
      nzContent: ReviewMajorConfigurationModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 800,
      nzComponentParams: {
        data: data, subjectGroups: subjectGroups, update: () => {
          this.getMajorById(this.majorId);
        }, callPlace: 'update'
      },
    });
    modal.afterClose.pipe(
      tap((rs) => {
      })
    ).subscribe();
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
            html: `Toàn bộ nội dung bạn vừa thay đổi Ở mục <b><i>Mô tả nghề nghiệp</i></b> sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
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
            html: `Toàn bộ nội dung bạn vừa thay đổi ở mục <b><i>Chương trình đào tạo</i></b> sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
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
            html: `Toàn bộ nội dung bạn vừa thay đổi ở mục <b><i>Tố chất nghề nghiệp</i></b> sẽ quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
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

  resetAll(): void {
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
        this.getMajorById(this.majorId)
      }
    });
  }

  resetSubjectGroup(): void {
    Swal.fire({
      title: 'LƯU Ý',
      html: `Toàn bộ các khối xét tuyển bạn vừa thêm vào danh sách sẽ biến mất và quay lại trạng thái ban đầu ngay sau khi load lên. Bạn có muốn đặt lại không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Xác nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeFormArray(this.getSubjectGroups);
        this.majorDetailTmp = { ...this.majorDetail, subjectGroups: this.majorDetail.subjectGroups.slice() }
        if (this.majorDetail.subjectGroups !== null) {
          this.majorDetail.subjectGroups.forEach(e => {
            const subjectWeights = this._fb.array([]);
            if (e.subjectWeights !== null) {
              e.subjectWeights.forEach(el => {
                const subjectWeightsField = this._fb.group({
                  'subjectId': [{ subjectId: el.id, subjectName: el.name }],
                  'weight': [el.weight, Validators.required],
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
      }
    });
  }

  renderConditionSubjectGroup(): boolean {
    if (this.majorDetail === undefined) {
      return false;
    }
    if (this.getSubjectGroups.controls.length === this.majorDetail.subjectGroups.length) {
      return false;
    }
    return true;
  }
  renderCondition(): boolean {
    const code = this.majorForm.get('code')['isUpdateHtml']
    const description = this.majorForm.get('description')['isUpdateHtml'];
    const curriculum = this.majorForm.get('curriculum')['isUpdateHtml'];
    const humanQuality = this.majorForm.get('humanQuality')['isUpdateHtml'];
    const salaryDescription = this.majorForm.get('salaryDescription')['isUpdateHtml']

    if (description && curriculum && humanQuality && salaryDescription && code && this.majorForm.dirty &&
      (this.majorForm.get('description').value !== this.majorDetail?.description)
    ) {
      return true;
    } else if (
      description && curriculum && humanQuality && salaryDescription && code && this.majorForm.dirty &&
      (this.majorForm.get('curriculum').value !== this.majorDetail?.curriculum)
    ) {
      return true;
    } else if (
      description && curriculum && humanQuality && salaryDescription && code && this.majorForm.dirty &&
      (this.majorForm.get('humanQuality').value !== this.majorDetail?.humanQuality)

    ) {
      return true
    } else if (description && curriculum && humanQuality && salaryDescription && code && this.majorForm.dirty &&
      (this.majorForm.get('salaryDescription').value !== this.majorDetail?.salaryDescription)) {
      return true;
    } else if (description && curriculum && humanQuality && salaryDescription && code && this.majorForm.dirty &&
      (this.majorForm.get('code').value !== this.majorDetail?.code)) {
      return true;
    }
    return false;
  }

}
