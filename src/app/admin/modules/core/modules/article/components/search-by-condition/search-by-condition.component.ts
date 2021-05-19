import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MajorService, UniversityService } from 'src/app/admin/services';
import { MajorRM } from 'src/app/admin/view-models';
import { University } from 'src/app/_models/university';

@Component({
  selector: 'app-search-by-condition',
  templateUrl: './search-by-condition.component.html',
  styleUrls: ['./search-by-condition.component.scss']
})
export class SearchByConditionComponent implements OnInit {

  listOfUniversity: University[];
  listOfDisplayUniversity: University[] = [];  
  listOfSelectedUniversity = [];

  listOfMajor: MajorRM[];
  listOfDisplayMajor: MajorRM[]=[];
  listOfSelectedMajor = [];

  publicFromDate: Date | Date[];
  publicToDate: Date | Date[];

  constructor(
    private _universityService: UniversityService,
    private _majorService: MajorService,
  ) { }

  ngOnInit() {
    this.getListOfUniversity();
    this.getListOfMajor();
  }

  getListOfUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap((rs) => {        
        this.listOfUniversity = rs.data
        this.listOfDisplayUniversity = rs.data
      })
    ).subscribe();    
  }

  getListOfMajor(): void {
    this._majorService.getAllMajor().pipe(
      tap((rs) => {        
        this.listOfMajor = rs.data;
        this.listOfDisplayMajor = rs.data;
      })
    ).subscribe();
  } 

}
