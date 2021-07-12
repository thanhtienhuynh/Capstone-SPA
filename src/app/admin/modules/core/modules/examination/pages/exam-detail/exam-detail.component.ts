import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { ExaminationService, SubjectService, UniversityService } from 'src/app/admin/services';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../../../_store/app.reducer';
import { User } from 'src/app/_models/user';
import Swal from 'sweetalert2';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Subject } from 'src/app/admin/view-models/subject.vm';
import { Response } from 'src/app/_models/response';
import { University } from 'src/app/_models/university';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TestDetail, TestQuestion, TestQuestionOption } from 'src/app/admin/view-models';
import { quillConfiguration } from 'src/app/admin/config';
import { ViewExamModalComponent } from '../../components';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class ExamDetailComponent implements OnInit {

  examId: string;
  exam: TestDetail;
  examTmp: TestDetail;
  examForm: FormGroup;
  subscription: Subscription;
  user: User;
  optionSelected: number = 0;
  listOfUniversity: University[];
  universityResult: Observable<Response<University[]>> = new BehaviorSubject<Response<University[]>>({} as Response<University[]>);
  listOfDisplayUniversity: Observable<University[]> = new BehaviorSubject<University[]>({} as University[]);

  editorOptions = quillConfiguration;
  listOfSubject: Subject[];
  subjectResult: Observable<Response<Subject[]>> = new BehaviorSubject<Response<Subject[]>>({} as Response<Subject[]>);
  listOfDisplaySubject: Observable<Subject[]> = new BehaviorSubject<Subject[]>({} as Subject[]);
  constructor(
    private _examService: ExaminationService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _subjectService: SubjectService,
    private _universityService: UniversityService,
    private _modalService: NzModalService,
    private store: Store<fromApp.AppState>
  ) {
    this.initExamForm();
  }

  ngOnInit() {
    this.getListOfUniversity();
    this.getListOfSubject();
    this._activatedRoute.params.subscribe((params) => {
      this.examId = params?.id;
      this.getExamDetail(this.examId);
    });
  }

  resetExamDetail(): void {    
    Swal.fire({
      title: 'LƯU Ý',
      html: "<p>Toàn bộ nội dung đã được thay đổi sẽ bị xóa, nội dung câu hỏi sẽ được trở về trạng thái ban đầu ngay sau khi load lên.</p><p>Bạn có muốn đặt lại không?</p>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Hủy',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.getExamDetail(this.examId);
      }
    })
  }

  makeAlphabet(index: number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    text += possible.charAt(Math.floor(index));
    return text;
  }
  initExamForm(): void {
    this.examForm = this._fb.group({
      'id': [''],
      'name': ['', Validators.required],
      'level': [1],
      'status': [1],
      'isSuggestedTest': [false],
      'year': [2021],
      'subjectId': [undefined],
      'userId': [0],
      'testTypeId': [1],
      'universityId': [undefined],
      'timeLimit': ['', Validators.required],
      'questions': this._fb.array([
        // this._fb.group({
        //   'id': [''],
        //   'content': ['', Validators.required],
        //   'numberOfOption': [1],
        //   'result': [''],
        //   'type': [1],
        //   'testId': [''],
        //   'isAnnotate': [false],
        //   'realOrder': [0],
        //   'options': this._fb.array([])
        // })
      ])
    })
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray
  }



  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getExamResult(result: string, optionIndex: number): boolean {
    // const tmp = result.split('0') as string[];  

    let tmp = [];
    for (let i = 0; i < result.length; i++) {
      tmp[i] = result.charAt(i);
    }
    for (let i = 0; i < tmp.length; i++) {
      const element = tmp[i];
      if (element === '1' && i === optionIndex) {
        return true;
      }
    }
    return false;
  }

  getMultipleExamResult(result: string, optionIndex: number): boolean {
    let tmp = [];
    for (let i = 0; i < result.length; i++) {
      tmp[i] = result.charAt(i);
    }
    for (let i = 0; i < tmp.length; i++) {
      const element = tmp[i];
      if (element === '0' && i === optionIndex) {
        return false;
      }
    }
    return true;
  }

  convertExamResultToString(result: boolean[]): string {
    let resultString = '';
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      if (element === true) {
        const tmpString = '1';
        resultString += tmpString;
      } else {
        const tmpString = '0';
        resultString += tmpString;
      }
    }
    return resultString;
  }

  setDataToExamForm(exam: TestDetail): void {
    this.examForm.reset();
    this.examForm.get('id').setValue(exam.id);
    this.examForm.get('name').setValue(exam.name);
    this.examForm.get('isSuggestedTest').setValue(exam.isSuggestedTest);
    this.examForm.get('status').setValue(1);
    this.examForm.get('level').setValue(exam.level);
    this.examForm.get('timeLimit').setValue(exam.timeLimit);
    this.examForm.get('testTypeId').setValue(exam.testTypeId);
    this.examForm.get('year').setValue(exam.year);
    const questions = this.examForm.get('questions') as FormArray;
    this.removeFormArray(questions);
    for (let questionIndex = 0; questionIndex < exam.questions.length; questionIndex++) {
      const questionTmp = exam.questions[questionIndex];
      const questionFormGroup = this._fb.group({
        'id': [questionTmp.id],
        'content': [questionTmp.content, Validators.required],
        'isAnnotate': [questionTmp.isAnnotate],
        'ordinal': [questionIndex],
        'type': [questionTmp.type],
        'numberOfOption': [questionTmp.numberOfOption],
        'options': this._fb.array([]),
      })
      questionFormGroup["isUpdate"] = false;
      questions.push(questionFormGroup);
      const options = questions.controls[questionIndex].get('options') as FormArray;
      for (let optionIndex = 0; optionIndex < questionTmp.options.length; optionIndex++) {
        const optionTmp = questionTmp.options[optionIndex];
        const result = this.getExamResult(questionTmp.result, optionIndex);
        // const result = questionTmp.type === 1 ? this.getExamResult(questionTmp.result, optionIndex) : this.getMultipleExamResult(questionTmp.result, optionIndex);        
        options.push(
          this._fb.group({
            'id': [optionTmp.id],
            'content': [optionTmp.content, Validators.required],
            'ordinal': [optionIndex],
            'isResult': [result]
          })
        )
      }
    }
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user;
      const userId: number = this.user.id;
      this.examForm.get('userId').setValue(userId as number);
    });
    this.examForm.get('universityId').setValue(this.listOfUniversity?.find(rs => rs?.id === exam?.universityId));
    this.examForm.get('subjectId').setValue(this.listOfSubject?.find(rs => rs?.id === exam?.subjectId));
  }

  getExamDetail(id: string): void {
    this._examService.getExamById(id).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            console.log(rs.data);
            this.exam = { ...rs.data };
            this.setDataToExamForm(this.exam);
            this.examTmp = { ...rs.data, questions: rs.data.questions.slice() }; //list lưu lại data nguyên thủy           
            console.log(this.exam.questions === this.examTmp.questions);
          }
        } else {

        }
      })
    ).subscribe();
  }

  addNewQuestion(currentQuestionIndex: number): void {
    const newQuestion = {      
      options: [],
      content: '',
      result: '',    
      numberOfOption: 0,
      type: 1,  
    } as TestQuestion;
    this.exam.questions.splice(currentQuestionIndex + 1, 0, newQuestion);
    const newQuestionFormGroup = this._fb.group({      
      'content': ['', Validators.required],
      'isAnnotate': [false],
      'ordinal': [currentQuestionIndex],
      'type': [1],
      'numberOfOption': [0],
      'options': this._fb.array([]),
    })    
    newQuestionFormGroup["isUpdate"] = true;  
    this.questions.insert(currentQuestionIndex + 1, newQuestionFormGroup);
    for (let i = currentQuestionIndex + 1; i < this.questions.controls.length; i++) {
      const element = this.questions.controls[i];
      element.get('ordinal').patchValue(i);
    }   
    // this.questions.controls.splice(currentQuestionIndex + 1, 0, newQuestionFormGroup);          
    console.log(this.questions);
  }

  removeQuestion(index: number) {
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[index].get('options') as FormArray;
    const tmp = this.findValidOptionContent(options);
    if (questions.controls[index].get('content').valid || tmp === 1) {
      Swal.fire({
        title: 'LƯU Ý',
        text: `TOÀN BỘ NỘI DUNG Ở CÂU HỎI SỐ ${index + 1} SẼ BỊ XÓA`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'HỦY',
        cancelButtonColor: '#d33',
        confirmButtonText: 'XÁC NHẬN'
      }).then((result) => {
        if (result.isConfirmed) {                    
          this.exam.questions.splice(index, 1);                    
          this.questions.removeAt(index);
        }
      })
    } else {
      this.exam.questions.splice(index, 1);  
      this.questions.removeAt(index);
      console.log(this.questions)
    }
  }

  examinationType(event: unknown): void {

  }

  getListOfSubject(): void {
    this._subjectService.getListOfSubject().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfSubject = rs.data;
          }
        }
      })
    ).subscribe();
    this.subjectResult = this._subjectService.getListOfSubject().pipe();
    this.listOfDisplaySubject = this.subjectResult.pipe(
      map(rs => rs.data)
    );
  }
  getListOfUniversity(): void {
    this._universityService.getAllUniversity().pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          if (rs.data !== null) {
            this.listOfUniversity = rs.data;
          }
        }
      })
    ).subscribe();
    this.universityResult = this._universityService.getAllUniversity().pipe();
    this.listOfDisplayUniversity = this.universityResult.pipe(
      map(rs => rs.data)
    );
  }

  openViewExamModal(): void {
    const questionTmp = this.questions.controls.map(rs => {
      const options = (rs.value.options as TestQuestionOption[]).map(rss => {
        return { content: rss.content, ordinal: rss.ordinal, isResult: rss.isResult }
      })
      const isAnnotate = rs.value.options?.length > 0 ? false : true;
      return { content: rs.value.content, isAnnotate: isAnnotate, ordinal: rs.value.ordinal, type: rs.value.type, options: options }
    }) as TestQuestion[];
    const universityId = this.examForm.get('universityId').value === null ? null : this.examForm.get('universityId').value?.id;
    const subjectId = this.examForm.get('subjectId').value === null ? null : this.examForm.get('subjectId').value.id
    const newValue = { ...this.examForm.value, universityId: universityId, subjectId: subjectId, questions: questionTmp }
    this._modalService.create({
      nzContent: ViewExamModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 850,
      nzComponentParams: {
        data: newValue, status: 'update', isLoading: false, examId: this.examId,
        callBack: (examId: string) => { this.getExamDetail(examId) }
      }
    });

  }

  questionTypeChange(event: any, questionIndex: any) {
    const question = this.exam.questions[questionIndex];
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;
    for (let i = 0; i < options.controls.length; i++) {
      const result = this.getExamResult(question.result, i);
      // const result = question.type === 1 ? this.getExamResult(question.result, i) : this.getMultipleExamResult(question.result, i); 
      const element = options.controls[i];
      element.get('isResult').setValue(result);
    }
  }

  selectNumberOfOption(event: any, questionIndex: any) {
    this.addNewOption(event, questionIndex);
  }

  findValidOptionContent(arr: FormArray): number {
    if (arr.length === 0) {
      return 0;
    }
    for (let i = 0; i < arr.controls.length; i++) {
      const element = arr.controls[i];
      if (element.get('content').valid) {
        return 1;
      }
    }
    return 0;
  }

  addNewOption(numberOfOptions: number, questionIndex: number): void {
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;
    const tmp = this.findValidOptionContent(options);
    console.log(tmp);
    if (tmp === 1) {
      Swal.fire({
        title: 'LƯU Ý',
        text: "Nội dung câu trả lời bạn đang nhập sẽ được làm mới",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'HỦY',
        cancelButtonColor: '#d33',
        confirmButtonText: 'XÁC NHẬN'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeFormArray(options);
          for (let i = 0; i < numberOfOptions; i++) {
            const element = numberOfOptions;
            options.push(
              this._fb.group({
                'content': ['', Validators.required],
                'ordinal': [i],
                'isResult': [false]
              })
            )
          }
        }
        if (result.isDismissed) {
          questions.controls[questionIndex].get('numberOfOption').patchValue(options.length);
        }
      })
    } else {
      this.removeFormArray(options);
      for (let i = 0; i < numberOfOptions; i++) {
        const element = numberOfOptions;
        options.push(
          this._fb.group({
            'content': ['', Validators.required],
            'ordinal': [i],
            'isResult': [false]
          })
        )
      }
    }
  }

  editQuestion(questionIndex: number) {
    this.questions.controls[questionIndex]["isUpdate"] = true;
  }



  switchCorrectAnswer(event: boolean, answerIndex: number, questionIndex: number, questionType: number) {
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;
    if (questionType === 1) {
      const isResult = options.controls[answerIndex].get('isResult');
      if (isResult.value === true) {
        for (let i = 0; i < options.controls.length; i++) {
          if (i !== answerIndex) {
            options.controls[i].get('isResult').setValue(false);
          }
        }
      }
    } else {

    }
  }

  saveEdit(questionIndex: number): void {
    const question = this.exam.questions[questionIndex];
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;
    this.questions.controls[questionIndex]["isUpdate"] = false;
  }

  resetQuestionData(questionIndex: number, callPlace: string): void {
    if (callPlace !== 'typescript') {
      Swal.fire({
        title: 'Lưu ý',
        html: `<p>Đặt lại nội dung của câu hỏi số ${questionIndex + 1}. Nội dung thay đổi sẽ biến mất.</p><p>Nếu bạn xác nhận, nội dung quay lại trạng thái ban đầu ngay sau khi load lên.</p><p>Bạn có muốn đặt lại không?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Hủy',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận'
      }).then((result) => {
        if (result.isConfirmed) {
          this.questions.controls[questionIndex]["isUpdate"] = false;
          this.scrollAfterAction(questionIndex);
          const question = this.exam.questions[questionIndex];
          const questions = this.examForm.get('questions') as FormArray;
          const options = questions.controls[questionIndex].get('options') as FormArray;
          questions.controls[questionIndex].get('content').patchValue(question.content);
          questions.controls[questionIndex].get('isAnnotate').patchValue(question.isAnnotate);
          questions.controls[questionIndex].get('ordinal').patchValue(questionIndex);
          questions.controls[questionIndex].get('type').patchValue(question.type);
          questions.controls[questionIndex].get('numberOfOption').patchValue(question.numberOfOption);
          this.removeFormArray(options);
          for (let i = 0; i < question.options.length; i++) {
            const result = this.getExamResult(question.result, i);
            // const result = question.type === 1 ? this.getExamResult(question.result, i) : this.getMultipleExamResult(question.result, i); 
            options.push(
              this._fb.group({
                'content': [question.options[i].content, Validators.required],
                'ordinal': [i],
                'isResult': [result]
              })
            )
          }
        }
      });
      return;
    }
    const question = this.exam.questions[questionIndex];
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;
    questions.controls[questionIndex].get('content').patchValue(question.content);
    questions.controls[questionIndex].get('isAnnotate').patchValue(question.isAnnotate);
    questions.controls[questionIndex].get('ordinal').patchValue(questionIndex);
    questions.controls[questionIndex].get('type').patchValue(question.type);
    questions.controls[questionIndex].get('numberOfOption').patchValue(question.numberOfOption);
    this.removeFormArray(options);
    for (let i = 0; i < question.options.length; i++) {
      const result = this.getExamResult(question.result, i);
      // const result = question.type === 1 ? this.getExamResult(question.result, i) : this.getMultipleExamResult(question.result, i); 
      options.push(
        this._fb.group({
          'content': [question.options[i].content, Validators.required],
          'ordinal': [i],
          'isResult': [result]
        })
      )
    }
  }

  cancelEdit(questionIndex: number): void {
    const question = this.exam.questions[questionIndex];
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;
    const tmpOptionForm = (options.value as any[]).map(rs => rs?.content);
    const tmpOption = question.options.map(rs => rs.content);
    const listDataChanged = tmpOption.filter(rs => rs !== tmpOptionForm.find(rss => rss === rs));
    const listOfResult = options.controls.map(rs => rs.get('isResult').value);
    const isResult = this.convertExamResultToString(listOfResult);
    console.log(isResult);
    if ((question.content !== questions.controls[questionIndex].get('content').value) ||
      (question.type !== questions.controls[questionIndex].get('type').value) ||
      (isResult !== this.exam.questions[questionIndex].result) ||
      listDataChanged.length > 0) {
      Swal.fire({
        title: 'Các mục chưa được lưu',
        html: `<p>Nội dung ở câu hỏi số ${questionIndex + 1} đã thay đổi.</p><p>Nếu bạn rời đi, nội dung đã thay đổi sẽ biến mất, và quay lại trạng thái ban đầu.</p><p>Bạn có muốn rời đi không?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Giữ nguyên',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Rời đi'
      }).then((result) => {
        if (result.isConfirmed) {
          this.questions.controls[questionIndex]["isUpdate"] = false;
          this.scrollAfterAction(questionIndex);
          this.resetQuestionData(questionIndex, 'typescript');
        }
      })
    } else {
      this.questions.controls[questionIndex]["isUpdate"] = false;
      this.scrollAfterAction(questionIndex);
      this.resetQuestionData(questionIndex, 'typescript');
    }
  }

  scrollAfterAction(questionIndex: number): void {
    if (questionIndex === 0) {
      document.getElementById('question-content-label').scrollIntoView();
    } else {
      document.getElementById((questionIndex - 1).toString()).scrollIntoView();
    }
  }

  drop(event: CdkDragDrop<any[]>): void {
    console.log(event);
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}

