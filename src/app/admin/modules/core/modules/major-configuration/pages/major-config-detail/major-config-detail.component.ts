import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import {
  MajorConfigurationService,
  SubjectGroupService,
  SubjectService,
} from 'src/app/admin/services';
import {
  MajorConfiguration,
  Subject,
  SubjectGroupFe,
  SubjectGroupVM,
} from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import Swal from 'sweetalert2';
import { ReviewMajorConfigurationModalComponent } from '../../components';

@Component({
  selector: 'app-major-config-detail',
  templateUrl: './major-config-detail.component.html',
  styleUrls: ['./major-config-detail.component.scss'],
})
export class MajorConfigDetailComponent implements OnInit {
  subjectGroupResult: Observable<Response<SubjectGroupVM[]>> =
    new BehaviorSubject<Response<SubjectGroupVM[]>>(
      {} as Response<SubjectGroupVM[]>
    );
  listOfDisplaySubjectGroup: Observable<SubjectGroupVM[]> = new BehaviorSubject<
    SubjectGroupVM[]
  >({} as SubjectGroupVM[]);
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
    this.subjectGroupResult = this._subjectGroupService
      .getAllSubjectGroup()
      .pipe();
    this.listOfDisplaySubjectGroup = this.subjectGroupResult.pipe(
      map((rs) => rs.data)
    );
  }

  getMajorById(id: number): void {
    this._majorConfigService
      .getMajorById(id)
      .pipe(
        tap((rs) => {
          if (rs.succeeded === true) {
            if (rs.data !== null) {
              this.majorDetail = { ...rs.data };
              this.setDataToMajorForm(this.majorDetail);
              this.majorDetailTmp = {
                ...rs.data,
                subjectGroups: rs.data.subjectGroups?.slice(),
              };
            }
          }
        })
      )
      .subscribe();
  }



  initMajorForm(): void {
    this.majorForm = this._fb.group({
      id: [''],
      name: [''],
      code: ['', Validators.required],
      description: [''],
      curriculum: [''],
      humanQuality: [''],
      salaryDescription: [''],
      // 'subjectGroup': this._fb.group({
      //   'id': [''],
      //   'subjectWeights': this._fb.array([])
      // }),
      subjectGroup: this._fb.array([]),
      status: [1],
    });
    this.majorForm.get('code')['isUpdateHtml'] = true;
    this.majorForm.get('description')['isUpdateHtml'] = true;
    this.majorForm.get('humanQuality')['isUpdateHtml'] = true;
    this.majorForm.get('curriculum')['isUpdateHtml'] = true;
    this.majorForm.get('salaryDescription')['isUpdateHtml'] = true;
    // this.majorForm.valueChanges.subscribe(rs => {
    //   console.log('valuechanges', rs);
    //   this.renderCondition()
    // })
  }
  get getSubjectGroups(): FormArray {
    return this.majorForm.get('subjectGroup') as FormArray;
  }

  get subjectWeightsUpdating(): FormArray {
    return (this.majorForm.get('subjectGroup') as FormGroup).controls
      .subjectWeights as FormArray;
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
      data.subjectGroups.forEach((e) => {
        const subjectWeights = this._fb.array([]);
        if (e.subjectWeights !== null) {
          e.subjectWeights.forEach((el) => {
            const subjectWeightsField = this._fb.group({
              subjectId: [
                { subjectId: el.id, subjectName: el.name },
                Validators.required,
              ],
              weight: [el.weight, Validators.required],
              isSpecialSubjectGroup: [el.isSpecialSubjectGroup],
            });
            subjectWeightsField['isUpdate'] = true;
            subjectWeightsField['isUpdateHtml'] = true;
            subjectWeights.push(subjectWeightsField);
          });
        }
        const subjectGroupfield = this._fb.group({
          id: [{ id: e.id, groupCode: e.groupCode }, Validators.required],
          status: [1],
          subjectWeights: subjectWeights,
        });
        subjectGroupfield['isUpdate'] = true;
        subjectGroupfield['isUpdateHtml'] = true;
        this.getSubjectGroups.push(subjectGroupfield);
      });
    }
  }

  addSubjectGroupToFirstIndex(): void {
    if (this.isCatchEditWeight) {
      this.isDisplay = false;
    }
    if (this.majorDetailTmp.subjectGroups === undefined) {
      this.majorDetailTmp.subjectGroups = [];
      this.majorDetailTmp.subjectGroups.unshift({
        id: null,
        status: 1,
        subjectWeights: [],
      });
      const newFbGroup = this._fb.group({
        id: [undefined, Validators.required],
        status: [1],
        subjectWeights: this._fb.array([]),
      });
      this.getSubjectGroups.insert(0, newFbGroup);
      return;
    }
    this.majorDetailTmp.subjectGroups.unshift({
      id: null,
      status: 1,
      subjectWeights: [],
    });
    const newFbGroup = this._fb.group({
      id: [undefined, Validators.required],
      status: [1],
      subjectWeights: this._fb.array([]),
    });
    this.getSubjectGroups.insert(0, newFbGroup);
  }
  addSubjectGroup(): void {
    this.getSubjectGroups.push(
      this._fb.group({
        id: [undefined, Validators.required],
        status: [1],
        subjectWeights: this._fb.array([]),
      })
    );
  }

  resetSubjectGroupDataByIndex(sjIndex: number): void {
    if (this.getSubjectGroups.controls[sjIndex]['isUpdate'] !== true) {
      return;
    }
    const subjectWeightsTmp = this.getSubjectGroups.controls[sjIndex].get(
      'subjectWeights'
    ) as FormArray;
    this.removeFormArray(subjectWeightsTmp);
    for (
      let i = 0;
      i < this.majorDetailTmp.subjectGroups[sjIndex].subjectWeights.length;
      i++
    ) {
      const element =
        this.majorDetailTmp.subjectGroups[sjIndex].subjectWeights[i];
      subjectWeightsTmp.push(
        this._fb.group({
          subjectId: [
            { subjectId: element.id, subjectName: element.name },
            Validators.required,
          ],
          weight: [element.weight, Validators.required],
          isSpecialSubjectGroup: [element.isSpecialSubjectGroup],
        })
      );
    }
  }

  tmpSubjetGroupParam: any[] = [];

  get handleSubjecGroupParam(): any[] {
    return this.tmpSubjetGroupParam;
  }
  removeSubjectGroup(index: number): void {
    const subjectName =
      this.getSubjectGroups.controls[index].get('id').value?.groupCode;
    if (this.getSubjectGroups.controls[index]['isUpdate'] !== true) {
      if(this.isCatchEditWeight){
        this.isDisplay = true;
      }
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
      confirmButtonText: 'XÁC NHẬN',
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.isCatchEditWeight){
          this.isDisplay = true;
        }
        this.majorDetailTmp.subjectGroups.splice(index, 1);
        const subjectGroupValue = this.getSubjectGroups.controls[index].value;
        const tmpSubjectGroupValue = { ...subjectGroupValue, status: 0 };
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
      const tmp = { subjectId: data[i].id, subjectName: data[i].name };
      subjectWeights.push(
        this._fb.group({
          subjectId: [tmp, Validators.required],
          weight: [1, Validators.required],
          isSpecialSubjectGroup: [data[i].isSpecialSubjectGroup],
        })
      );
    }
  }

  getSubjectsPerSubjectGroup(id: number, index: number): void {
    this._subjectGroupService
      .getSubjectsBySubjectGroupId(id)
      .pipe(
        tap((rs) => {
          if (rs.succeeded === true) {
            if (rs.data !== null) {
              this.addSubjectWeights(index, rs.data.subjects as Subject[]);
            }
          } else {
          }
        })
      )
      .subscribe();
  }
  useSelectSubjectGroup(
    data: { id?: number; groupCode?: string },
    index: number
  ): void {
    this.getSubjectsPerSubjectGroup(data.id, index);
  }

  updateMajorToSystem(): void {
    const handleList = this.handleSubjecGroupParam as SubjectGroupFe[];
    const subjectGroupList = this.getSubjectGroups.controls.map(
      (rs) => rs.value
    ) as SubjectGroupFe[];
    const latsList = handleList.filter(
      (rs) =>
        rs?.id?.id !==
        subjectGroupList.find((rss) => rss?.id?.id === rs?.id?.id)?.id.id
    );
    const subjectGroupValue = subjectGroupList.concat(latsList);
    const lastValue = subjectGroupValue.map((rs) => {
      const subjectWeightValue = rs?.subjectWeights?.map((_) => {
        const tmp = { ..._, subjectId: _?.subjectId?.subjectId };
        return tmp;
      });
      const tmp = { ...rs, id: rs?.id?.id, subjectWeights: subjectWeightValue };
      return tmp;
    });
    const description =
      this.majorForm.get('description').value ===
        '<h2 class="ql-align-justify"><br></h2>' ||
      this.majorForm.get('description').value === ''
        ? null
        : this.majorForm.get('description').value;
    const curriculum =
      this.majorForm.get('curriculum').value ===
        '<h2 class="ql-align-justify"><br></h2>' ||
      this.majorForm.get('curriculum').value === ''
        ? null
        : this.majorForm.get('curriculum').value;
    const humanQuality =
      this.majorForm.get('humanQuality').value ===
        '<h2 class="ql-align-justify"><br></h2>' ||
      this.majorForm.get('humanQuality').value === ''
        ? null
        : this.majorForm.get('humanQuality').value;
    const salaryDescription =
      this.majorForm.get('salaryDescription').value ===
        '<h2 class="ql-align-justify"><br></h2>' ||
      this.majorForm.get('salaryDescription').value === ''
        ? null
        : this.majorForm.get('salaryDescription').value;
    const newValue = {
      ...this.majorForm.value,
      status: 1,
      curriculum: curriculum,
      humanQuality: humanQuality,
      salaryDescription: salaryDescription,
      description: description,
      subjectGroup: lastValue,
    };
    console.log(newValue);
    this.openReviewModal(
      newValue,
      this.getSubjectGroups.controls.map((rs) => rs.value)
    );
  }

  openReviewModal(data: any, subjectGroups: any): void {
    const modal = this._modalService.create({
      nzContent: ReviewMajorConfigurationModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 800,
      nzComponentParams: {
        data: data,
        subjectGroups: subjectGroups,
        update: () => {
          this.getMajorById(this.majorId);
        },
        callPlace: 'update',
      },
    });
    modal.afterClose.pipe(tap((rs) => {})).subscribe();
  }


  getMajorFormControls(controlName: string, index?: number): void {
    switch (controlName) {
      case 'code':
        this.majorForm.get('code')['isUpdateHtml'] = false;
        this.isDisplay = false;
        break;
      case 'description':
        this.majorForm.get('description')['isUpdateHtml'] = false;
        this.isDisplay = false;
        break;
      case 'curriculum':
        this.majorForm.get('curriculum')['isUpdateHtml'] = false;
        this.isDisplay = false;
        break;
      case 'humanQuality':
        this.majorForm.get('humanQuality')['isUpdateHtml'] = false;
        this.isDisplay = false;
        break;
      case 'salaryDescription':
        this.majorForm.get('salaryDescription')['isUpdateHtml'] = false;
        this.isDisplay = false;
        break;
      case 'weight': {
        this.getSubjectGroups.controls[index][
          'isUpdateHtml'
        ] = false;
        this.isDisplay = false;
        this.isCatchEditWeight = false;

        break;
      }
      default:
        break;
    }
  }

  saveData(controlName: string, index?: number): void {
    switch (controlName) {
      case 'code':
        this.majorForm.get('code')['isUpdateHtml'] = true;
        if((this.majorForm.get('code').value !== this.majorDetail?.code && this.isCatchDisplay)
        || (this.majorForm.get('code').value === this.majorDetail?.code && this.isCatchDisplay)
        ){
          this.isDisplay = true;
        } else {
          this.isDisplay = false;
        }
        break;
      case 'description':
        this.majorForm.get('description')['isUpdateHtml'] = true;
        if((this.majorForm.get('description').value !== this.majorDetail?.description && this.isCatchDisplay)
          || (this.majorForm.get('description').value === this.majorDetail?.description && this.isCatchDisplay)
        ){
          this.isDisplay = true;
        } else {
          this.isDisplay = false
        }
        break;
      case 'curriculum':
        this.majorForm.get('curriculum')['isUpdateHtml'] = true;
        if((this.majorForm.get('curriculum').value !== this.majorDetail?.curriculum && this.isCatchDisplay)
        || (this.majorForm.get('curriculum').value === this.majorDetail?.curriculum && this.isCatchDisplay)){
          this.isDisplay = true;
        } else {
          this.isDisplay = false;
        }
        break;
      case 'humanQuality':
        this.majorForm.get('humanQuality')['isUpdateHtml'] = true;
        if((this.majorForm.get('humanQuality').value !== this.majorDetail?.humanQuality && this.isCatchDisplay)
        || (this.majorForm.get('humanQuality').value === this.majorDetail?.humanQuality && this.isCatchDisplay)
        ){
          this.isDisplay = true;
        } else {
          this.isDisplay = false;
        }
        break;
      case 'salaryDescription':
        this.majorForm.get('salaryDescription')['isUpdateHtml'] = true;
        if((this.majorForm.get('salaryDescription').value !== this.majorDetail?.salaryDescription)
          || (this.majorForm.get('salaryDescription').value === this.majorDetail?.salaryDescription)
        ){
          this.isDisplay = true;
        } else {
          this.isDisplay = false;
        }
        break;
      case 'weight': {
        this.getSubjectGroups.controls[index][
          'isUpdateHtml'
        ] = true;
        this.isCatchEditWeight = true;
        this.testCondition(index);
        break;
      }
      default:
        break;
    }
  }

  isDisplay: boolean = false;
  isCatchDisplay: boolean = false;
  isCatchEditWeight: boolean = true;

  testCondition(index?: number): void {
    console.log(index);
    const subjectGroup = this.getSubjectGroups.controls[index].get('subjectWeights') as FormArray;
    const tmpSubjectGroup = this.majorDetail.subjectGroups[index];
    for (let y = 0; y < subjectGroup.controls.length; y++) {
      const weight = subjectGroup.controls[y].get('weight');
      const weight2 = tmpSubjectGroup.subjectWeights[y].weight;
      if (weight.value !== weight2) {
        this.isDisplay = true;
        this.isCatchDisplay = true;
      }
    }
  }

  cancelData(controlName: string): void {
    switch (controlName) {
      case 'code':
        if (this.majorForm.get('code').value === this.majorDetail.code) {
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
            confirmButtonText: 'Xác nhận',
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('code')['isUpdateHtml'] = true;
              this.majorForm.get('code').patchValue(this.majorDetail.code);
            }
          });
        }
        break;
      case 'description':
        if (
          this.majorForm.get('description').value ===
          this.majorDetail.description
        ) {
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
            confirmButtonText: 'Xác nhận',
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('description')['isUpdateHtml'] = true;
              this.majorForm
                .get('description')
                .patchValue(this.majorDetail.description);
            }
          });
        }
        break;
      case 'curriculum':
        if (
          this.majorForm.get('curriculum').value === this.majorDetail.curriculum
        ) {
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
            confirmButtonText: 'Xác nhận',
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('curriculum')['isUpdateHtml'] = true;
              this.majorForm
                .get('curriculum')
                .patchValue(this.majorDetail.curriculum);
            }
          });
        }
        break;
      case 'humanQuality':
        if (
          this.majorForm.get('humanQuality').value ===
          this.majorDetail.humanQuality
        ) {
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
            confirmButtonText: 'Xác nhận',
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('humanQuality')['isUpdateHtml'] = true;
              this.majorForm
                .get('humanQuality')
                .patchValue(this.majorDetail.humanQuality);
            }
          });
        }
        break;
      case 'salaryDescription':
        if (
          this.majorForm.get('salaryDescription').value ===
          this.majorDetail.salaryDescription
        ) {
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
            confirmButtonText: 'Xác nhận',
          }).then((result) => {
            if (result.isConfirmed) {
              this.majorForm.get('salaryDescription')['isUpdateHtml'] = true;
              this.majorForm
                .get('salaryDescription')
                .patchValue(this.majorDetail.salaryDescription);
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
      confirmButtonText: 'Xác nhận',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDisplay = false;
        this.isCatchDisplay = false;
        this.getMajorById(this.majorId);
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
      confirmButtonText: 'Xác nhận',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDisplay = false;
        this.isCatchDisplay = false;
        this.removeFormArray(this.getSubjectGroups);
        this.majorDetailTmp = {
          ...this.majorDetail,
          subjectGroups: this.majorDetail.subjectGroups?.slice(),
        };
        if (this.majorDetail.subjectGroups !== null) {
          this.majorDetail.subjectGroups.forEach((e) => {
            const subjectWeights = this._fb.array([]);
            if (e.subjectWeights !== null) {
              e.subjectWeights.forEach((el) => {
                const subjectWeightsField = this._fb.group({
                  subjectId: [
                    { subjectId: el.id, subjectName: el.name },
                    Validators.required,
                  ],
                  weight: [el.weight, Validators.required],
                  isSpecialSubjectGroup: [el.isSpecialSubjectGroup],
                });
                subjectWeightsField['isUpdate'] = true;
                subjectWeightsField['isUpdateHtml'] = true;
                subjectWeights.push(subjectWeightsField);
              });
            }
            const subjectGroupfield = this._fb.group({
              id: [{ id: e.id, groupCode: e.groupCode }, Validators.required],
              status: [1],
              subjectWeights: subjectWeights,
            });
            subjectGroupfield['isUpdate'] = true;
            subjectGroupfield['isUpdateHtml'] = true;
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
    if (this.majorDetail.subjectGroups !== null) {
      if (
        this.getSubjectGroups.controls.length ===
        this.majorDetail.subjectGroups.length
      ) {
        return false;
      }
    }
    return true;
  }

  renderConditionWeight(): boolean {
    if (this.majorDetail === undefined) {
      return false;
    }
    return false;
  }

  renderCondition(): boolean {
    // console.log(this.getSubjectGroups.controls[0].get('subjectWeights'));
    const code = this.majorForm.get('code')['isUpdateHtml'];
    const description = this.majorForm.get('description')['isUpdateHtml'];
    const curriculum = this.majorForm.get('curriculum')['isUpdateHtml'];
    const humanQuality = this.majorForm.get('humanQuality')['isUpdateHtml'];
    const salaryDescription = this.majorForm.get('salaryDescription')['isUpdateHtml'];

    if (
      description &&
      curriculum &&
      humanQuality &&
      salaryDescription &&
      code &&
      this.majorForm.dirty &&
      this.majorForm.get('description').value !== this.majorDetail?.description &&
      this.getSubjectGroups?.valid
    ) {
      return true;
    } else if (
      description &&
      curriculum &&
      humanQuality &&
      salaryDescription &&
      code &&
      this.majorForm.dirty &&
      this.majorForm.get('curriculum').value !== this.majorDetail?.curriculum &&
      this.getSubjectGroups?.valid
    ) {
      return true;
    } else if (
      description &&
      curriculum &&
      humanQuality &&
      salaryDescription &&
      code &&
      this.majorForm.dirty &&
      this.majorForm.get('humanQuality').value !==
        this.majorDetail?.humanQuality &&
      this.getSubjectGroups?.valid
    ) {
      return true;
    } else if (
      description &&
      curriculum &&
      humanQuality &&
      salaryDescription &&
      code &&
      this.majorForm.dirty &&
      this.majorForm.get('salaryDescription').value !==
        this.majorDetail?.salaryDescription &&
      this.getSubjectGroups?.valid
    ) {
      return true;
    } else if (
      description &&
      curriculum &&
      humanQuality &&
      salaryDescription &&
      code &&
      this.majorForm.dirty &&
      this.majorForm.get('code').value !== this.majorDetail?.code &&
      this.getSubjectGroups?.valid
    ) {
      return true;
    } else if (this.getSubjectGroups.length > 0) {
      if (
        this.getSubjectGroups?.controls.length !==
          this.majorDetail.subjectGroups?.length &&
        this.getSubjectGroups?.valid &&
        description &&
        curriculum &&
        humanQuality &&
        salaryDescription &&
        code
      ) {
        return true;
      }
    } else if (
      description &&
      curriculum &&
      humanQuality &&
      salaryDescription &&
      code &&
      this.getSubjectGroups.dirty &&
      this.getSubjectGroups?.valid
    ) {
      return true;
    }
    // console.log('Chay gium con voi');
    //     console.log(code, 'code');
    // console.log(description, 'description');
    // console.log(curriculum, 'curriculum');
    // console.log(humanQuality, 'humanQuality');
    // console.log(salaryDescription, 'salaryDescription');
    return false;
  }

  changeWeight(): boolean {
    if (this.getSubjectGroups.dirty) {
      return true;
    }
    return false;
  }
}
