import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MajorRM, SubjectGroupRM } from 'src/app/admin/view-models';

import { CreateMajorModalComponent } from '../../components';

@Component({
  selector: 'app-university-detail',
  templateUrl: './university-detail.component.html',
  styleUrls: ['./university-detail.component.scss']
})
export class UniversityDetailComponent implements OnInit {

  listOfSubjectGroup: SubjectGroupRM[] = [
    {
      id: 1,
      groupCode: 'A'
    },
    {
      id: 2,
      groupCode: 'A1'
    },
    {
      id: 3,
      groupCode: 'D'
    }
  ];

  listOfMajor: MajorRM[] = [
    {
      'id': 1,
      'code': 'QTKD',
      'name': 'Quản trị kinh doanh', 
      'numberOfStudent': 100
    },
    {
      'id': 2,
      'code': 'IT',
      'name': 'Công nghệ thông tin',
      'numberOfStudent': 300
    },
    {
      'id': 3,
      'code': 'GV',
      'name': 'Sư phạm',
      'numberOfStudent': 200

    }    
  ];
  constructor(
    private _modalService: NzModalService
  ) { }

  ngOnInit() {
    console.log(this.listOfSubjectGroup.length);
  }

  openCreateMajorModal(data: any | undefined): void {    
    this._modalService.create({
      nzContent: CreateMajorModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700,   
      nzComponentParams: {data: data}   
    })
  }
}
