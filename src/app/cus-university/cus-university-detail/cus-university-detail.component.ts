import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PagedResponse } from 'src/app/_models/paged-response';
import { Cell, CusEntryMark, CusMajorDetail, CusSubAdmission, CusUniversity, CusUniversityMajorDetail, MajorDetailFilter, Row, UniSeason } from 'src/app/_models/university';
import * as fromApp from '../../_store/app.reducer';
import * as HomeActions from '../../home/store/home.actions';
import { PageParam } from 'src/app/_params/page-param';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cus-university-detail',
  templateUrl: './cus-university-detail.component.html',
  styleUrls: ['./cus-university-detail.component.scss']
})
export class CusUniversityDetailComponent implements OnInit, OnDestroy {
  form: FormGroup;
  seasonControl: FormControl;

  university: CusUniversity;
  subsription: Subscription;
  majors: CusUniversityMajorDetail[] = [];
  cusMajorDetailPageResponse: PagedResponse<CusUniversityMajorDetail[]>;
  isLoading: boolean;
  seasons: UniSeason[];
  selectedSeasonId: number;
  
  firstButtonValue: number;
  secondButtonValue: number;
  thirdButtonValue: number;
  fourthButtonValue: number;
  lastButtonValue: number;

  constructor(private store: Store<fromApp.AppState>) {
    this.form = new FormGroup({
    });
   }

  ngOnInit() {
    this.store.dispatch(new HomeActions.ResetState());
    this.store.dispatch(new HomeActions.LoadSeasons());
    this.subsription = this.store.select('home').subscribe((homeState) => {
      if (this.university != homeState.selectedUniversity) {
        this.university = homeState.selectedUniversity;
      }

      if (this.seasons != homeState.seasons) {
        this.seasons = homeState.seasons;
        console.log('ss: ', this.seasons);
        if (this.seasons != null && this.seasons.length > 0) {
          this.selectedSeasonId = this.seasons.find(s => s.status)?.id;
          if (!this.selectedSeasonId) {
            this.selectedSeasonId = this.seasons[0].id;
          }
          this.seasonControl = new FormControl(this.selectedSeasonId);
          this.form.addControl(
            'season', this.seasonControl
          );
          console.log('form ss:',  this.form);
          this.form.controls['season'].valueChanges.subscribe(c => {
            console.log(c);
            this.store.dispatch(new HomeActions.LoadUniversityMajorDetail(
                {pageFilter: new PageParam(1, 10), queryFilter: new MajorDetailFilter({majorCode: null, order: 4, majorName: null, seasonId: c, universityId: this.university.id})}));
          });
          console.log("Subscribe nha");
          if (this.university) {
            this.store.dispatch(new HomeActions.LoadUniversityMajorDetail(
              {pageFilter: new PageParam(1, 10), queryFilter: new MajorDetailFilter({majorCode: null, order: 4, majorName: null, seasonId: this.selectedSeasonId, universityId: this.university.id})}));
          }
        }
      }


      
      if (this.cusMajorDetailPageResponse != homeState.cusMajorDetailPageResponse) {
        this.cusMajorDetailPageResponse = homeState.cusMajorDetailPageResponse;
        this.rows = [];
        this.majors = [];
        if (this.cusMajorDetailPageResponse && this.cusMajorDetailPageResponse.data && this.cusMajorDetailPageResponse.data.length > 0) {
          this.cusMajorDetailPageResponse.data.map(major => {
            let countChild2 = 0;
            let programs: CusMajorDetail[] = [];
            major.majorDetailUnies.map(program => {
              let admissions: CusSubAdmission[] = [];
              let countChild1 = 0;
              if (program.majorDetailSubAdmissions == null || program.majorDetailSubAdmissions.length <= 0) {
                program.majorDetailSubAdmissions = [];
                program.majorDetailSubAdmissions.push({id: null, admissionMethodId: null, rows: 1, provinceName: null, admissionMethodName: null,
                  genderId: null, provinceId: null, quantity: null, majorDetailEntryMarks:
                  [{id: null, rows: 1, subjectGroupId: null, majorSubjectGoupId: null, mark: null, subjectGroupCode: null}]})
              }
              program.majorDetailSubAdmissions.map(admission => {
                let countChild = 0;
                let entryMarks: CusEntryMark[] = [];
                if (admission.majorDetailEntryMarks == null || admission.majorDetailEntryMarks.length <= 0) {
                  countChild += 1;
                  entryMarks.push({subjectGroupCode: null, mark: null, rows: 1, id: null, majorSubjectGoupId: null, subjectGroupId: null});
                } else {
                  admission.majorDetailEntryMarks.map (entryMark => {
                    entryMark = {...entryMark, rows: 1}
                    countChild += entryMark.rows;
                    entryMarks.push(entryMark);
                  })
                }
                admission = {...admission, rows: countChild, majorDetailEntryMarks: entryMarks};
                countChild1 += admission.rows;
                admissions.push(admission);
              })
              program = {...program, rows: countChild1, majorDetailSubAdmissions: admissions};
              countChild2 += program.rows;
              programs.push(program);
            })
            major = {...major, rows: countChild2, majorDetailUnies: programs}
            this.majors.push(major)
          })
          this.generateRows();
          this.generatePagingButton();
        }
      }

      if (this.isLoading != homeState.isLoading) {
        this.isLoading = homeState.isLoading;
      }
    });
  }

  rows: Row[] = [];
  generateRows() {
    let row: Row = new Row();
    let cells: Cell[] = [];
    this.majors.forEach((major, a) => {
      cells.push({data: major.majorName.toUpperCase(), rowspan: major.rows, isNumber: false});
      major.majorDetailUnies.forEach((program, b) => {
        cells.push({data: program.trainingProgramName, rowspan: program.rows, isNumber: false});
        cells.push({data: program.majorDetailCode, rowspan: program.rows, isNumber: false});
        cells.push({data: program.admissionQuantity, rowspan: program.rows, isNumber: true});
        program.majorDetailSubAdmissions.forEach((admission, c) => {
          let gender = null;
          if (admission.genderId == 0) {
            gender = "Nam";
          } else if (admission?.genderId == 1) {
            gender = "Nữ";
          }
          let provinceName = admission.provinceName;
          let admissionName = admission.admissionMethodName;
          if (gender) {
            admissionName += " - " + gender;
          }
          if (provinceName) {
            admissionName += " - " + provinceName;
          }
          cells.push({data: admissionName, rowspan: admission.rows, isNumber: false});
          cells.push({data: admission.quantity, rowspan: admission.rows, isNumber: true});
          admission.majorDetailEntryMarks.forEach ((entryMark, d) => {
            cells.push({data: entryMark.subjectGroupCode, rowspan: entryMark.rows, isNumber: false});
            cells.push({data: entryMark.mark, rowspan: entryMark.rows, isNumber: true});
            row.cells = cells;
            row.isOdd = a % 2 != 0;
            this.rows.push(row);
            cells = [];
            row = new Row();
          })
        }) 
      })
    });
  }

  generatePagingButton() {
    this.firstButtonValue = -1;
    this.secondButtonValue = -1;
    this.thirdButtonValue = -1;
    this.fourthButtonValue = -1;
    this.lastButtonValue = -1;
    if (this.cusMajorDetailPageResponse) {
      if (this.cusMajorDetailPageResponse.pageNumber == 1) {
        this.secondButtonValue = 1;
        this.thirdButtonValue = this.cusMajorDetailPageResponse.totalPages >= 2 ? 2 : -1;
        this.fourthButtonValue = this.cusMajorDetailPageResponse.totalPages >= 3 ? 3 : -1;
      } else if (this.cusMajorDetailPageResponse.pageNumber > 1 && this.cusMajorDetailPageResponse.pageNumber < this.cusMajorDetailPageResponse.totalPages) {
        this.secondButtonValue = this.cusMajorDetailPageResponse.previousPage;
        this.thirdButtonValue = this.cusMajorDetailPageResponse.pageNumber;
        this.fourthButtonValue = this.cusMajorDetailPageResponse.nextPage;
      } else if (this.cusMajorDetailPageResponse.pageNumber == this.cusMajorDetailPageResponse.totalPages) {
        this.fourthButtonValue = this.cusMajorDetailPageResponse.pageNumber;
        this.thirdButtonValue = this.cusMajorDetailPageResponse.pageNumber - 1;
        this.secondButtonValue = this.cusMajorDetailPageResponse.pageNumber - 2;
      }
      if (this.fourthButtonValue != this.cusMajorDetailPageResponse.totalPages &&
        this.thirdButtonValue != this.cusMajorDetailPageResponse.totalPages &&
        this.secondButtonValue != this.cusMajorDetailPageResponse.totalPages) {
        this.lastButtonValue = this.cusMajorDetailPageResponse.totalPages;
      }

      if (this.secondButtonValue != 1 && this.thirdButtonValue != 1 && this.fourthButtonValue != 1) {
        this.firstButtonValue = 1;
      }
    }
  }

  pageClick(pageNumber: number) {
    this.store.dispatch(new HomeActions.LoadUniversityMajorDetail(
      {pageFilter: new PageParam(pageNumber), queryFilter: new MajorDetailFilter({majorCode: null, order: 4, majorName: null, seasonId: 5, universityId: this.university.id})}));
  }


  ngOnDestroy() {
    if (this.subsription) {
      this.subsription.unsubscribe();
    }
  }

}
