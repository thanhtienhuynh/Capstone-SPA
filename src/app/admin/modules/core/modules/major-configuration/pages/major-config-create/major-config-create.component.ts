import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from 'src/app/_models/response';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MajorConfigurationService, SubjectGroupService } from 'src/app/admin/services';
import { Subject, SubjectGroupVM } from 'src/app/admin/view-models';
import { quillConfiguration } from 'src/app/admin/config';
import Swal from 'sweetalert2';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReviewMajorConfigurationModalComponent } from '../../components';

@Component({
  selector: 'app-major-config-create',
  templateUrl: './major-config-create.component.html',
  styleUrls: ['./major-config-create.component.scss']
})
export class MajorConfigCreateComponent implements OnInit {

  editorOptions = quillConfiguration;
  addMajorForm: FormGroup;

  subjectGroupResult: Observable<Response<SubjectGroupVM[]>> = new BehaviorSubject<Response<SubjectGroupVM[]>>({} as Response<SubjectGroupVM[]>);
  listOfDisplaySubjectGroup: Observable<SubjectGroupVM[]> = new BehaviorSubject<SubjectGroupVM[]>({} as SubjectGroupVM[]);
  constructor(            
    private _subjectGroupService: SubjectGroupService,
    private _majorConfigService: MajorConfigurationService,
    private _modalService: NzModalService,
    private _fb: FormBuilder
  ) { 
    this.initAddForm();
  }

  ngOnInit() {
    this.getListOfSubjectGroup();
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
      'description': [''],
      'curriculum': [''],
      'humanQuality': [''],
      'salaryDescription': [''],
      'subjectGroups': this._fb.array([
        this._fb.group({
          'id': [undefined, Validators.required],
          'subjectWeights': this._fb.array([])
        })
      ])
    })
  }

  addNewMajorToSystem(): void {
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
    this.openCreateModal(newValue);
    // this._majorConfigService.addNewMajorToSystem(newValue).pipe(
    //   tap(rs => {
    //     if (rs.succeeded === true) {
    //       Swal.fire({
    //         position: 'center',
    //         icon: 'success',
    //         title: 'THÊM NGÀNH VÀO HỆ THỐNG THÀNH CÔNG',
    //         showConfirmButton: false,
    //         timer: 1500
    //       });         
    //     } else {
    //       Swal.fire({
    //         position: 'center',
    //         icon: 'error',
    //         title: rs.errors[0],
    //         showConfirmButton: false,
    //         timer: 1500
    //       })
    //     }
    //   })
    // ).subscribe();
  }

  openCreateModal(data: any): void {
    const modal = this._modalService.create({
      nzContent: ReviewMajorConfigurationModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 800,
      nzComponentParams: {
        data: data, callPlace: 'create', update: () => {
          this.resetForm();
        }
      },
    });
    modal.afterClose.pipe(
      tap((rs) => {
      })
    ).subscribe();
  }

  get getSubjectGroups(): FormArray {
    return this.addMajorForm.get('subjectGroups') as FormArray
  }

  addSubjectGroup(): void {
    this.getSubjectGroups.push(
      this._fb.group({
        'id': [undefined, Validators.required],
        'status': [1],
        'subjectWeights': this._fb.array([])
      })
    );
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

  removeSubjectGroup(index: number): void {
    this.getSubjectGroups.removeAt(index);
  }

  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
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

  resetForm(): void {
    this.addMajorForm.reset();
  }
  
}
