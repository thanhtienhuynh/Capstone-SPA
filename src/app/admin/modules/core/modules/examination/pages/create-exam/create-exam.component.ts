import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { quillConfiguration } from 'src/app/admin/config';
import { ExaminationService, SubjectService, UniversityService } from 'src/app/admin/services';
import { Subject } from 'src/app/admin/view-models/subject.vm';
import { Response } from 'src/app/_models/response';
import { University } from 'src/app/_models/university';
import { ViewExamModalComponent } from '../../components';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../../../_store/app.reducer';
import * as AuthActions from '../../../../../../../authentication/store/auth.actions';
import { User } from 'src/app/_models/user';
import Swal from 'sweetalert2';
// import * as fromApp from '../../../../../ _store/app.reducer';
// import * as AuthActions from '../../../../../authentication/store/auth.actions';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.scss']
})
export class CreateExamComponent implements OnInit {

  editorOptions = quillConfiguration;

  subscription: Subscription;
  user: User;
  isLoading = false;
  optionSelected: number = 0;  
  switchCorrectAns: boolean = false;

  examForm: FormGroup;

  universityResult: Observable<Response<University[]>> = new BehaviorSubject<Response<University[]>>({} as Response<University[]>); 
  listOfDisplayUniversity: Observable<University[]> = new BehaviorSubject<University[]>({} as University[]);
  subjectResult: Observable<Response<Subject[]>> = new BehaviorSubject<Response<Subject[]>>({} as Response<Subject[]>);
  listOfDisplaySubject: Observable<Subject[]> = new BehaviorSubject<Subject[]>({} as Subject[]);

  selectedItem = 1;
  constructor(
    private _subjectService: SubjectService,
    private _universityService: UniversityService,
    private _examinationService: ExaminationService,
    private _modalService: NzModalService,
    private _fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {
    this.initExamForm();
   }

  ngOnInit() {
    this.getListOfSubject();
    this.getListOfUniversity();
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.user = authState.user; 
      const userId: number = this.user.id;  
      this.examForm.get('userId').setValue(userId as number);   
    });    
  }

  makeAlphabet(index: number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    text += possible.charAt(Math.floor(index));
    return text;
  }
     

  initExamForm(): void {
    this.examForm = this._fb.group({
      'name': ['', Validators.required],
      'level': [1],
      'year': [2021],
      'subjectId': [undefined],
      'userId': [0],
      'testTypeId': [1],
      'universityId': [undefined],
      'timeLimit': ['', Validators.required],
      'isSuggestedTest': [true],
      'questions': this._fb.array([
        this._fb.group({
          'content': ['', Validators.required],
          'type': [1],
          'isAnnotate': [false],
          'ordinal': [0],
          'options': this._fb.array([])
        })
      ])
    })
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray
  }  

  addNewQuestion(quesionIndex: number): void {
    this.questions.push(
      this._fb.group({
        'content': ['', Validators.required],
        'type': [1],
        'isAnnotate': [false],
        'ordinal': [quesionIndex],
        'options': this._fb.array([])
      })
    )
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
          this.questions.removeAt(index);
        }
      })      
    } else {  
      this.questions.removeAt(index);          
    }    
  }

  test(): void {
    
      
  }


  removeFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  selectNumberOfOption(event: number, questionIndex: number): void {
    this.addNewOption(event, questionIndex);
  }

  getListOfSubject(): void {
    this.subjectResult = this._subjectService.getListOfSubject().pipe();
    this.listOfDisplaySubject = this.subjectResult.pipe(
      map(rs => rs.data)
    );
  }

  getListOfUniversity(): void {
    this.universityResult = this._universityService.getAllUniversity().pipe();
    this.listOfDisplayUniversity = this.universityResult.pipe(
      map(rs => rs.data)
    ); 
  }

  createExam(): void {          
    const universityId = this.examForm.get('universityId').value === null ? null : this.examForm.get('universityId').value?.id;
    const subjectId = this.examForm.get('subjectId').value === null ? null : this.examForm.get('subjectId').value?.id
    const newValue = {...this.examForm.value, universityId: universityId, subjectId: subjectId}
    console.log(newValue);
    this._examinationService.createNewExam(newValue).pipe(
      tap(rs => { 
        console.log(rs);       
        if (rs.succeeded === true) {
          this.isLoading = false;
        } else {
          
        }        
      })
    ).subscribe();    
  }

  correctRadioAnswer(event: string, questionIndex: number, optionIndex: number): void {
    console.log(`Giá trị: ${event}`, `questionIndex: ${questionIndex}`, `optionIndex: ${optionIndex}`);
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;        
    for (let i = 0; i < options.controls.length; i++) {
      const element = options.controls[i];
      if (optionIndex === i) {
        element.get('isResult').setValue(true);
      } else {
        element.get('isResult').setValue(false);
      }      
    }
  }  

  correctCheckboxAnswer(event: string, questionIndex: number, optionIndex: number): void {
    console.log(`Giá trị: ${event}`, `questionIndex: ${questionIndex}`, `optionIndex: ${optionIndex}`);
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;  
    for (let i = 0; i < options.controls.length; i++) {
      const element = options.controls[i];
      if (optionIndex === i) {
        element.get('isResult').setValue(event);
      }    
    }  
  }
  
  questionTypeChange(event, questionIndex: number): void {
    const questions = this.examForm.get('questions') as FormArray;
    const options = questions.controls[questionIndex].get('options') as FormArray;   
    for (let i = 0; i < options.controls.length; i++) {
      const element = options.controls[i];
      element.get('isResult').setValue(false);     
    }
    console.log(event);
  }

  examinationType(event: any): void{
    this.examForm.get('universityId').setValue(null);
  }

  openViewExamModal(): void {
    this._modalService.create({
      nzContent: ViewExamModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 800,  
      nzComponentParams: { data: this.examForm.value, isLoading: this.isLoading}    
    });
  } 
  
  switchCorrectAnswer(event: boolean, answerIndex: number, questionIndex: number, questionType: number): void {    
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
}
