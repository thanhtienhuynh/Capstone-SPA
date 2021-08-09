import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { tap } from 'rxjs/operators';
import { ExaminationService } from 'src/app/admin/services';
import { TestBySubject } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-list-by-subject',
  templateUrl: './exam-list-by-subject.component.html',
  styleUrls: ['./exam-list-by-subject.component.scss']
})
export class ExamListBySubjectComponent implements OnInit {

  total: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  subjectId: any;

  selectedYear: number = null;
  selectedTestType: number = null;
  searchValueName: string = '';
  visible: boolean = false;

  listOfExamBySubject: (TestBySubject & { stt?: number })[] = [];
  examSubjectForm: FormArray;

  constructor(
    private _examService: ExaminationService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.initExamSubjectForm();
  }

  ngOnInit() {
    // this.getListOfExam(1, 10, null, null, null, 1, null);
  }

  initExamSubjectForm(): void {
    this.examSubjectForm = this._fb.array([])
  }

  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  setDataToForm(data: (TestBySubject & { stt?: number })[]): void {
    this.removeFormArray(this.examSubjectForm);
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.examSubjectForm.push(
        this._fb.group({
          'isSuggestedTest': [element.isSuggestedTest]
        })
      )
    }
  }

  getListOfExam(pageNumber: number, pageSize: number, name: string, year: number, testTypeId: number, subjectId: number, order: number): void {
    this._examService.getListOfExam(pageNumber, pageSize, name, year, testTypeId, subjectId, order).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfExamBySubject = rs.data.map((e, i) => ({
              ...e,
              stt: (rs.pageNumber * rs.pageSize) - (rs.pageSize - (i + 1)),
              // isSuggestedTest: i === 0 ? true : false
            }));;
            this.total = rs.totalRecords;
            this.setDataToForm(this.listOfExamBySubject);
          } else {
            this.listOfExamBySubject = [];
          }
        } else {
          this.listOfExamBySubject = [];
        }
      })
    ).subscribe();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this._activatedRoute.params.subscribe((pr) => {
      this.subjectId = pr?.id;
      this.getListOfExam(params.pageIndex, params.pageSize, null, null, null, this.subjectId, null)
    });
  }

  getSubjectName(subjectId: string): string {
    switch (subjectId) {
      case '1':
        return 'TOÁN'
      case '2':
        return 'Toán'
      case '3':
        return 'VẬT LÝ'
      case '4':
        return 'HÓA HỌC'
      case '5':
        return 'TIẾNG ANH'
      case '6':
        return 'SINH HỌC'
      case '7':
        return 'ĐỊA LÝ'
      case '8':
        return 'LỊCH SỬ'
      default:
        break;
    }
  }

  chooseSuggestedTest(examIndex: number, exam: TestBySubject & { stt?: number }, event: boolean): void {
    Swal.fire({
      title: event === true ? 'XÁC NHẬN' : 'LƯU Ý',
      html: event === true ? `<p>Setup <b><i>${exam.name}</i></b> Làm bài thi gợi ý?</p>` : `<p>Xóa <b><i>${exam.name}</i></b> khỏi danh sách các bài viết được chọn làm bài thi gợi ý?</p>`,
      icon: event === true ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'HỦY',
      cancelButtonColor: '#d33',
      confirmButtonText: 'XÁC NHẬN'
    }).then((result) => {
      if (result.isConfirmed) {
        const newValue = {
          'testId': exam.id,
          'isSuggestTest': event,
        };
        this._examService.setUpSuggestedTest(newValue).pipe(
          tap(rs => {
            if (rs.succeeded === true) {
              this.getListOfExam(this.pageIndex, this.pageSize, null, null, null, this.subjectId, null);
              Swal.fire('Thành công', 'Cập nhật thành công', 'success');
              // for (let i = 0; i < this.examSubjectForm.controls.length; i++) {
              //   const isSuggestedTest = this.examSubjectForm.controls[i].get('isSuggestedTest');
              //   if (i !== examIndex) {
              //     isSuggestedTest.setValue(false);
              //   }
              // }
            } else {
              Swal.fire('Lỗi', '', 'error');
              // this.examSubjectForm.controls[examIndex].get('isSuggestedTest').patchValue(exam.isSuggestedTest)
              this.getListOfExam(this.pageIndex, this.pageSize, null, null, null, this.subjectId, null);
            }
          })
        ).subscribe();
      }
      if (result.isDismissed) {
        this.getListOfExam(this.pageIndex, this.pageSize, null, null, null, this.subjectId, null);
        // this.examSubjectForm.controls[examIndex].get('isSuggestedTest').setValue(exam.isSuggestedTest)
      }
    })
  }

  switchSuggestedTest(event: boolean, examIndex: number, exam: TestBySubject & { stt?: number, isSuggestedTest?: boolean }): void {
    if (event === true) {
      for (let i = 0; i < this.examSubjectForm.controls.length; i++) {
        const isSuggestedTest = this.examSubjectForm.controls[i].get('isSuggestedTest');
        if (i !== examIndex) {
          isSuggestedTest.setValue(false);
        }
      }
      Swal.fire({
        title: 'XÁC NHẬN',
        text: "Nội dung câu trả lời bạn đang nhập sẽ được làm mới",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'HỦY',
        cancelButtonColor: '#d33',
        confirmButtonText: 'XÁC NHẬN'
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.examSubjectForm.controls.length; i++) {
            const isSuggestedTest = this.examSubjectForm.controls[i].get('isSuggestedTest');
            if (i !== examIndex) {
              isSuggestedTest.setValue(false);
            }
          }
        }
        if (result.isDismissed) {
          this.examSubjectForm.controls[examIndex].get('isSuggestedTest').patchValue(exam.isSuggestedTest)
        }
      })
    }
  }

  searchByName(): void {
    const searchValueNameTmp: string = this.searchValueName === '' ? null : this.searchValueName;
    this.getListOfExam(1, 10, searchValueNameTmp, this.selectedYear, this.selectedTestType, this.subjectId, null);
  }

  resetSearchName(): void {
    this.searchValueName = '';
    const searchValueNameTmp: string = this.searchValueName === '' ? null : this.searchValueName;
    this.getListOfExam(1, 10, searchValueNameTmp, this.selectedYear, this.selectedTestType, this.subjectId, null);
  }

  searchByYear(event: number): void {
    this.selectedYear = event;
    const searchValueNameTmp: string = this.searchValueName === '' ? null : this.searchValueName;
    this.getListOfExam(1, 10, searchValueNameTmp, this.selectedYear, this.selectedTestType, this.subjectId, null);
  }

  searchByTestType(event: number): void {
    this.selectedTestType = event;
    const searchValueNameTmp: string = this.searchValueName === '' ? null : this.searchValueName;
    this.getListOfExam(1, 10, searchValueNameTmp, this.selectedYear, this.selectedTestType, this.subjectId, null);
  }

  redirectToCreateExam(): void {
    this._router.navigate(['admin/core/examination/create-exam']);
  }
}
