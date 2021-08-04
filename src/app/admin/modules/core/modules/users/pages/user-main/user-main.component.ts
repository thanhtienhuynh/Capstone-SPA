import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { tap } from 'rxjs/operators';
import { UserConfigurationService } from 'src/app/admin/services/users-configuration/user-configuration.service';
import { User } from 'src/app/_models/user';
import Swal from 'sweetalert2';
import { UpdateUserModalComponent } from '../../components';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})
export class UserMainComponent implements OnInit {

  isLoadingData: boolean = false;
  visible: boolean = false;
  isVisibleHeader = 0;
  total = 100;
  pageSize = 10;
  pageIndex = 1;
  searchValueName: string = '';
  listOfUser: User[];
  listOfDisplayUser: User[];
  constructor(
    private _modalService: NzModalService,
    private _userConfig: UserConfigurationService
  ) { }

  ngOnInit() {
  }

  getListOfUser(pageNumber: number, pageSize: number, fullName: string, email: string, role: number, isActive: number): void {
    this.isLoadingData = true;
    this._userConfig.getListOfUser(pageNumber, pageSize, fullName, email, role, isActive).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.isLoadingData = false
            this.listOfUser = rs.data;
            this.listOfDisplayUser = [...rs.data.map((e, i) => ({
              ...e,
              stt: (rs.pageNumber * rs.pageSize) - (rs.pageSize - (i + 1))
            }))
            ];
            this.total = rs.totalRecords;
          } else {
            this.listOfUser = [];
            this.listOfDisplayUser = [...this.listOfUser];
            Swal.fire('Lỗi', `${rs.errors[0]}`, 'error')
          }
        } else {
          this.listOfUser = [];
          this.listOfDisplayUser = [...this.listOfUser];
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error')
        }
      })
    ).subscribe();
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.getListOfUser(this.pageIndex, this.pageSize, null, null, null, null);
  }

  searchByName(): void {
    this.getListOfUser(this.pageIndex, this.pageSize, this.searchValueName, null, null, null);
  }

  resetSearchName(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchValueName = '';
    this.getListOfUser(this.pageIndex, this.pageSize, this.searchValueName, null, null, null);
  }

  openUpdateModal(data: User): void {
    this._modalService.create({
      nzContent: UpdateUserModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700,
      nzComponentParams: {
        data: data,
        callBack: () => {
          this.getListOfUser(this.pageIndex, this.pageSize, null, null, null, null);
        }
      }
    });
  }

}
