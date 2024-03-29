import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { UniversityRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';



import { CreateUniversityModalComponent, UniversityDetailModalComponent } from '../../components';
import { DeactiveUniversityModalComponent } from '../../components/modals/deactive-university-modal/deactive-university-modal.component';


@Component({
  selector: 'app-university-main',
  templateUrl: './university-main.component.html',
  styleUrls: ['./university-main.component.scss'],
})
export class UniversityMainComponent implements OnInit {

  isLoadingData = false;
  visible = false;

  total = 100;
  pageSize = 10;
  pageIndex = 1;
  listOfUniversity: (UniversityRM & { stt?: number })[] = [];
  listOfDisplayUniversity: (UniversityRM & { stt?: number })[] = [];
  //------------------SEARCH SORT FILTER------------------------
  filterStatus = [
    { text: 'Đang Hoạt Động', value: '1' },
    { text: 'Không Hoạt Động', value: '0' }
  ];

  filterTuition = [
    { text: 'Theo Kì', value: 1 },
    { text: 'Theo Năm', value: 0 }
  ];
  searchValueName: string = '';
  constructor(
    private _modalService: NzModalService,
    protected _universityService: UniversityService
  ) { }

  ngOnInit() {
    // this.getAllUniversity();
    this.getListOfUniversity(1, 10, '', '');
  }

  getListOfUniversity(pageNumber: number, pageSize: number, name: string, status: string): void {
    this.isLoadingData = true;
    this._universityService.getListOfUniversity(pageNumber, pageSize, name, status).pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.isLoadingData = false;
            this.listOfUniversity = rs.data.map((e, i) => ({
              ...e,
              phones: e.phone.split('-'),
              stt: (rs.pageNumber * rs.pageSize) - (rs.pageSize - (i + 1))
            }));
            this.listOfDisplayUniversity = [...this.listOfUniversity];
            this.total = rs.totalRecords;
          } else {
            this.listOfUniversity = [];
            this.listOfDisplayUniversity = [...this.listOfUniversity];
          }
        } else {
        }
      }),
      catchError((err) => {
        return of(undefined);
      })
    ).subscribe();
  }

  getDefaultList(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchValueName = '';
    this.getListOfUniversity(1, 10, '', '');
  }

  getAllUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {
        if (rs.succeeded === true) {
          if (rs.data !== null && rs.data !== [] ) {
            this.listOfUniversity = rs.data.map((e, i) => ({
              ...e,
              phones: e.phone.split('-'),
              stt: i + 1
            }));
            this.listOfDisplayUniversity = [...this.listOfUniversity];
            this.total = this.listOfUniversity.length;
          }
        } else {
        }
      }),
      catchError((err) => {
        return of(undefined);
      })
    ).subscribe();
  }

  openCreateUniversityModal(): void {
    this._modalService.create({
      nzContent: CreateUniversityModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700,
      nzComponentParams: {
        callBack: (item) => {
          this.listOfUniversity.push(item);
          this.listOfUniversity.splice(0, 0, item);
          // this.listOfDisplayUniversity = [...this.listOfUniversity];
          this.listOfDisplayUniversity = this.listOfUniversity.map((e, i) => ({
            ...e,
            stt: i + 1
          }));
        }
        , index: this.listOfUniversity.length
      }
    });
  }

  openDeactiveModal(data: UniversityRM, action: string): void {
    this._modalService.create({
      nzContent: DeactiveUniversityModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700,
      nzComponentParams: {
        callBack: () => {
          // this.getDefaultList();
          this.getListOfUniversity(this.pageIndex, this.pageSize, '', '');
        },
        data: data, action: action
      }
    });
  }



  // searchByName(searchValue: string): void {
  //   this.listOfDisplayUniversity = this.listOfUniversity.filter((item: UniversityRM & {stt?:number, phones?:string[]}) => item?.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
  // }
  filterStatusFn = (status: number, item: UniversityRM) => item.status === status;
  filterTuitionTypeFn = (tuitionType: number, item: UniversityRM) => item.tuitionType === tuitionType;

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    const status = params.filter.filter(rs => rs.key === 'status')[0].value;
    const tuition = params.filter.filter(rs => rs.key === 'tuition')[0].value;
    if (status === null) {
      this.getListOfUniversity(params.pageIndex, params.pageSize, this.searchValueName, '');
      return;
    };
    this.getListOfUniversity(params.pageIndex, params.pageSize, this.searchValueName, status);
  }

  // openDetailUniversityModal(uniId: number): void {
  //   this._modalService.create({
  //     nzContent: UniversityDetailModalComponent,
  //     nzClosable: false,
  //     nzFooter: null,
  //     nzWidth: 1024,
  //     nzComponentParams: { universityId: uniId },
  //   })
  // }

  searchByName(): void {
    this.getListOfUniversity(1, this.pageSize, this.searchValueName, '');
  }

  resetSearchName(): void {
    this.searchValueName = '';
    this.searchByName();
    this.pageIndex = 1;
    this.pageSize = 10;
  }
}
