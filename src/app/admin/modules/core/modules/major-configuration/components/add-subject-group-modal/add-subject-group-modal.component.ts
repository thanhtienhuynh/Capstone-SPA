import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MajorConfigurationService, SubjectGroupService, SubjectService } from 'src/app/admin/services';
import { MajorConfiguration, Subject, SubjectGroupVM } from 'src/app/admin/view-models';
import { Response } from 'src/app/_models/response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subject-group-modal',
  templateUrl: './add-subject-group-modal.component.html',
  styleUrls: ['./add-subject-group-modal.component.scss']
})
export class AddSubjectGroupModalComponent implements OnInit {

  @Input() data: MajorConfiguration;
  @Input() callBack: (pageNumber: number, pageSize: number, majorName: string) => void;
  @Input() callPlace: any;

  isLoading: boolean = false;

  subjectGroupResult: Observable<Response<SubjectGroupVM[]>> = new BehaviorSubject<Response<SubjectGroupVM[]>>({} as Response<SubjectGroupVM[]>);
  listOfDisplaySubjectGroup: Observable<SubjectGroupVM[]> = new BehaviorSubject<SubjectGroupVM[]>({} as SubjectGroupVM[]);
  addSubjectGroupForm: FormGroup;
  constructor(
    private _modalRef: NzModalRef,
    private _subjectService: SubjectService,
    private _subjectGroupService: SubjectGroupService,
    private _majorConfigService: MajorConfigurationService,
    private _fb: FormBuilder
  ) { 
    this.initAddSubjectGroupForm();
  }

  ngOnInit() {    
    this.getListOfSubjectGroup();
    this.setDataToForm(this.data);
  }

  initAddSubjectGroupForm(): void {
    this.addSubjectGroupForm = this._fb.group({
      'id': [''],
      'name': ['', Validators.required],
      'code': ['', Validators.required],
      'description': [''],
      'humanQuality': [''],
      'curriculum': [''],
      'salaryDescription': [''],
      'status': [1],
      'subjectGroup': this._fb.array([
        this._fb.group({          
          'id': [undefined, Validators.required],
          'status': [1],
          'subjectWeights': this._fb.array([])
        })
      ])
    })
  }

  setDataToForm(data: MajorConfiguration): void {
    this.addSubjectGroupForm.get('id').setValue(data.id);
    this.addSubjectGroupForm.get('name').setValue(data.name.toUpperCase());
    this.addSubjectGroupForm.get('code').setValue(data.code);
    this.addSubjectGroupForm.get('description').setValue(data.description);
    this.addSubjectGroupForm.get('humanQuality').setValue(data.humanQuality);
    this.addSubjectGroupForm.get('curriculum').setValue(data.curriculum);
    this.addSubjectGroupForm.get('salaryDescription').setValue(data.salaryDescription);
  }

  get getSubjectGroups(): FormArray {
    return this.addSubjectGroupForm.get('subjectGroup') as FormArray
  }

  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
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

  removeSubjectGroup(index: number): void {
    this.getSubjectGroups.removeAt(index);
  }

  useSelectSubjectGroup(data: { id?: number, groupCode?: string }, index: number): void {    
    this.getSubjectsPerSubjectGroup(data.id, index);
  }

  getListOfSubjectGroup(): void {
    this.subjectGroupResult = this._subjectGroupService.getAllSubjectGroup().pipe();
    this.listOfDisplaySubjectGroup = this.subjectGroupResult.pipe(
      map(rs => this.data.subjectGroups !== null ? rs.data.filter(rs => rs.id !== this.data.subjectGroups.find(rss => rss.id === rs.id)?.id) : rs.data)
    )
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
  addSubjectWeights(index: number, data: Subject[]): void {
    const subjectGroup = this.getSubjectGroups.controls[index];
    const subjectWeights = subjectGroup.get('subjectWeights') as FormArray;
    this.removeFormArray(subjectWeights);
    for (let i = 0; i < data.length; i++) {
      const tmp = {subjectId: data[i].id, subjectName: data[i].name}
      subjectWeights.push(        
        this._fb.group({
          'subjectId': [tmp, Validators.required],
          'weight': [1, Validators.required],
          'isSpecialSubjectGroup': [data[i].isSpecialSubjectGroup]
        })
      );
    }
  }

  addNewSubjectGroup(): void {        
    this.isLoading = true;
    const subjectGroupsValues = this.getSubjectGroups.controls.map(rs => rs.value);
    const subjectGroups = subjectGroupsValues.map(rs => {
      const subjectWeightTmp = rs?.subjectWeights.map(rss => {
        const tmp = {...rss, subjectId: rss.subjectId?.subjectId};
        return tmp;
      })
      const tmp = {...rs, id: rs.id?.id, subjectWeights: subjectWeightTmp};
      return tmp
    });    
    const newValue = {...this.addSubjectGroupForm.value, subjectGroup: subjectGroups}      
    this._majorConfigService.updateMajorToSystem(newValue).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'THAY ĐỔI THÔNG TIN THÀNH CÔNG',
            showConfirmButton: false,
            timer: 1500
          })
          this.callBack(1, 10, this.addSubjectGroupForm.get('name').value);
          this.closeModal();
        } else {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `${rs.errors[0]}`,
            showConfirmButton: false,
            timer: 1500
          })          
        }

      })
    ).subscribe();
  }

  closeModal(): void {
    this._modalRef.close();
  }
}
