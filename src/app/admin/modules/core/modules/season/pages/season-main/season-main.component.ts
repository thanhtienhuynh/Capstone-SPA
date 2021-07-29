import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { tap } from 'rxjs/operators';
import { SeasonService } from 'src/app/admin/services/season/season.service';
import { Season } from 'src/app/admin/view-models';
import { CreateSeasonModalComponent, UpdateSeasonModalComponent } from '../../components';


@Component({
  selector: 'app-season-main',
  templateUrl: './season-main.component.html',
  styleUrls: ['./season-main.component.scss']
})
export class SeasonMainComponent implements OnInit {

  isLoadingData: boolean = false;
  visible: boolean = false;
  searchValueName: string = '';
  total: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;

  listOfSeason: Season[] = [];
  listOfDisplaySeason: Season[] = [];
  constructor(
    private _modalService: NzModalService,
    private _seasonService: SeasonService
  ) { }

  ngOnInit() {
  }

  getListOfSeason(): void {
    this.isLoadingData = true;
    this._seasonService.getListOfSeason().pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoadingData = false;
          this.listOfSeason = [...rs.data];
          this.listOfDisplaySeason = [...this.listOfSeason];
        } else {
          this.isLoadingData = false;
          this.listOfDisplaySeason = [];
        }
      })
    ).subscribe();
  }
  searchByName(): void {

  }

  resetSearchName(): void {

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.getListOfSeason();
  }

  openCreateSeasonModal(): void {
    this._modalService.create({
      nzContent: CreateSeasonModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700,
      nzComponentParams: {
        callBack: () => {
          this.getListOfSeason()
        }, 
        listOfSeason: this.listOfSeason.concat({id: 1000, name: 'None', status: 1})
      }
    });
  }

  openUpdateSeasonModal(action: string, season: Season): void {
    this._modalService.create({
      nzContent: UpdateSeasonModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700,
      nzComponentParams: {
        callBack: () => {
          this.getListOfSeason()
        }, 
        action: action, season: season, listOfSeason: this.listOfSeason.concat({id: 1000, name: 'None', status: 1})
      }
    });
  }

}
