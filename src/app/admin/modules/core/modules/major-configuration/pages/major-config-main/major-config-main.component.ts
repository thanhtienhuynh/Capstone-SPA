import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { tap } from 'rxjs/operators';
import { MajorConfigurationService, UniversityService } from 'src/app/admin/services';
import { MajorConfiguration } from 'src/app/admin/view-models';
import { AddSubjectGroupModalComponent, MajorConfigurationModalComponent } from '../../components';

@Component({
  selector: 'app-major-config-main',
  templateUrl: './major-config-main.component.html',
  styleUrls: ['./major-config-main.component.scss']
})
export class MajorConfigMainComponent implements OnInit {

  isLoadingData: boolean = false;
  isVisibleHeader = 0;
  total = 100;
  pageSize = 10;
  pageIndex = 1;
  searchValueName: string = '';
  visible: boolean = false;

  listOfSubjectWeight: MajorConfiguration[];
  listOfDisplaySubjectWeight: MajorConfiguration[];
  constructor(
    private _modalService: NzModalService,
    private _universityService: UniversityService,
    private _activatedRoute: ActivatedRoute,
    private _majorConfigService: MajorConfigurationService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.getListOfSubjectWeight(1, 10, '');
  }

  scroll = (event): void => {
    if (event.target.scrollTop > 200) {
      this.isVisibleHeader = event.target.scrollTop;
    } else {
      this.isVisibleHeader = 0;
    }
  }

  getDefault(): void {
    this.searchValueName = '';
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getListOfSubjectWeight(this.pageIndex, this.pageSize, this.searchValueName)
  }
  getListOfSubjectWeight(pageNumber: number, pageSize: number, majorName: string): void {
    this.isLoadingData = true;
    this._majorConfigService.getListOfSubjectWeight(pageNumber, pageSize, majorName).pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoadingData = false;
          if (rs.data !== null) {            
            this.listOfSubjectWeight = rs.data;          
            this.listOfDisplaySubjectWeight = [...rs.data.map((e, i) => ({
              ...e,
              stt: (rs.pageNumber * rs.pageSize) - (rs.pageSize - (i + 1))            
            }))
            ];
            this.total = rs.totalRecords;
          } else {
            this.listOfSubjectWeight = [];
          }       
        } else {
          this.isLoadingData = false;
        }
      }),
    ).subscribe();
  }

  onQueryParamsChange(params: NzTableQueryParams): void { 
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;   
    this.getListOfSubjectWeight(params.pageIndex, params.pageSize, this.searchValueName);
  }

  searchByName(): void {
    this.getListOfSubjectWeight(1, 10, this.searchValueName);
  }

  resetSearchName(): void {
    this.searchValueName = '';
    this.searchByName();
    this.pageIndex = 1;
    this.pageSize = 10;
  }

  openMajorConfigurationModal(data: MajorConfiguration | undefined): void {    
    if (data !== undefined) {
      if (data.subjectGroups !== null) {
        const modal = this._modalService.create({
          nzContent: MajorConfigurationModalComponent,
          nzClosable: false,
          nzFooter: null,
          nzWidth: data !== undefined ? 600 : 600,
          nzComponentParams: { data: data, callBack: (pageNumber: number, pageSize: number, majorName: string) => { this.getListOfSubjectWeight(pageNumber, pageSize, majorName) } },
        });
        modal.afterClose.pipe(
          tap((rs) => {
          })
        ).subscribe();
      } else {
        this.openAddSubjectGroupToMajor(data);
      }
    } else {
      const modal = this._modalService.create({
        nzContent: MajorConfigurationModalComponent,
        nzClosable: false,
        nzFooter: null,
        nzWidth: data !== undefined ? 600 : 600,
        nzComponentParams: { data: data, callBack: (pageNumber: number, pageSize: number, majorName: string) => { this.getListOfSubjectWeight(pageNumber, pageSize, majorName) } },
      });
      modal.afterClose.pipe(
        tap((rs) => {
        })
      ).subscribe();
    }
  }

  openAddSubjectGroupToMajor(data: MajorConfiguration): void {
    const modal = this._modalService.create({
      nzContent: AddSubjectGroupModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: data !== undefined ? 600 : 600,
      nzComponentParams: { data: data, callBack: (pageNumber: number, pageSize: number, majorName: string) => { this.getListOfSubjectWeight(pageNumber, pageSize, majorName) } },
    });
    modal.afterClose.pipe(
      tap((rs) => {
      })
    ).subscribe();
  }
}
