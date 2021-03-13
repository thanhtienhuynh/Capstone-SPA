import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UniversityRM } from 'src/app/admin/view-models';



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
  total = 20;
  pageSize = 10;
  pageIndex = 1;
  listOfUniversity: UniversityRM[] = [
    {
      'id': '1',
      'code': 'QSB',
      'name': 'Trường Đại học Khoa học Tự nhiên - ĐHQG TPHCM',
      'address': '227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh',
      'logoUrl': 'assets/logo-white.png',
      'tuition': 'học phí 1 kì là 200.000đ',
      'information': 'Trường Đại học Khoa học Tự nhiên - ĐHQG TPHCM',
      'rating': 4,
      'status': 1
    },
    {
      'id': '2',
      'code': 'QSK',
      'name': 'Trường Đại học Kinh tế - Luật',
      'address': '669 QL1A, khu phố 3, Thủ Đức, Thành phố Hồ Chí Minh',
      'logoUrl': 'assets/logo-white.png',
      'tuition': 'học phí 1 kì là 200.000đ',
      'information': '+84.987.6543',
      'rating': 3.5,
      'status': 0
    },
    {
      'id': '3',
      'code': 'FPT',
      'name': 'Trường Đại học FPT - HCM',
      'address': 'Lô E2a-7, Đường D1, Khu Công Nghệ Cao, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh 700000',
      'logoUrl': 'assets/logo-white.png',
      'tuition': 'học phí 1 kì là 27.500.000đ',
      'information': '+84.123.456.78',
      'rating': 5,
      'status': 1
    },
    {
      'id': '4',
      'code': 'YDS',
      'name': 'Trường Đại học Y Dược TP.HCM',
      'address': '217 Hồng Bàng, Phường 11, Quận 5, Thành phố Hồ Chí Minh',
      'logoUrl': 'assets/logo-white.png',
      'tuition': 'học phí 1 kì là 200.000đ',
      'information': '+84.987.6543',
      'rating': 3.5,
      'status': 0
    },
    {
      'id': '5',
      'code': 'SPK',
      'name': 'Trường Đại học Sư phạm Kỹ thuật TP.HCM',
      'address': '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh',
      'logoUrl': 'assets/logo-white.png',
      'tuition': 'học phí 1 kì là 200.000đ',
      'information': '+84.987.6543',
      'rating': 3.5,
      'status': 1
    },
  ];
  constructor(
    private _modalService: NzModalService
  ) { }

  ngOnInit() {    
  }

  openCreateUniversityModal(): void {
    this._modalService.create({
      nzContent: CreateUniversityModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700      
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {    
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;    
  }

}
