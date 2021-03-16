import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UniversityService } from 'src/app/admin/services';
import { UniversityRM } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';



import { CreateUniversityModalComponent } from '../../components';


@Component({
  selector: 'app-university-main',
  templateUrl: './university-main.component.html',
  styleUrls: ['./university-main.component.scss']
})
export class UniversityMainComponent implements OnInit {

  //Rating
  ratingTooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  loading: true;

  //Paging
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  listOfUniversity: UniversityRM[] = [];
  constructor(
    private _modalService: NzModalService,
    protected _universityService: UniversityService
  ) { }

  ngOnInit() {    
    this.getAllUniversity();    
  }

  getAllUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {     
        console.log(rs);                      
        this.listOfUniversity = rs;  
        this.total = this.listOfUniversity.length;
        this.total = this.listOfUniversity.length;      
      }),
      catchError((err) => {
        console.log(err);
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
      nzComponentParams: {callBack: this.getAllUniversity}    
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {    
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;    
  }

}
