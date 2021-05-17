import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, PageModel } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';
import { TopArticleComponent } from '../top-article/top-article.component';

@Component({
  selector: 'board-article-list',
  templateUrl: './board-article-list.component.html',
  styleUrls: ['./board-article-list.component.scss']
})


export class BoardArticleListComponent implements OnInit, OnChanges {

  @Input() listOfArticle: ArticleVM[];
  @Input() landTitle: string;
  @Input() action: string;
  @Input() totalRecords: number;
  @Input() callBack: (pageNumber:number, pageSize:number, status:number) => void;

  // @ViewChildren(TopArticleComponent) topArticleComponent: TopArticleComponent;
  @Output() searchValueTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() paging = new EventEmitter();

  initPageSize: number = 10;
  initPageNumber: number = 1;  

  constructor(
    private _articleService: ArticleService,
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {    
    // console.log('onChange list',this.listOfArticle, this.action);
    console.log('onChange total', this.totalRecords, this.action);
  }

  ngOnInit() {
    // console.log('onInit list', this.listOfArticle, this.action);
    console.log('onInit total' , this.totalRecords, this.action);
  }

  updateTopArticle(data: number[]): void {
    this._articleService.updateTopArticle(data).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Thiết lập thành công',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Thiết lập thất bại',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
    ).subscribe()
  }


  drop(event: CdkDragDrop<any[]>) {     
    console.log(event);  
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      if (event.container.id === "cdk-drop-list-0") {
           
      }
      if (event.container.id === "cdk-drop-list-1") {
        if (event.currentIndex !== event.previousIndex) {
          Swal.fire({
            title: 'CẢNH BÁO',
            text: `Điều chỉnh bài viết ${event.container.data[event.previousIndex]?.title} từ TOP ${event.previousIndex + 1} --> TOP ${event.currentIndex + 1} bài viết HOT nhất!?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'BỎ QUA',
            confirmButtonText: 'XÁC NHẬN'
          }).then((result) => {
            if (result.isConfirmed) {            
              moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);   
              const data = event.container.data.map(rs => rs?.id);            
              this.updateTopArticle(data);              
            }
          }) 
        }        
        // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);  
      }           
    }
    else {
      Swal.fire({
        title: 'CẢNH BÁO',
        text: event.previousContainer.id === "cdk-drop-list-0" 
        ? `Thiết lập bài viết ${event.previousContainer.data[event.previousIndex]?.title} làm TOP ${event.currentIndex + 1} bài viết HOT nhất!?` 
        : `Điều chỉnh bài viết ${event.previousContainer.data[event.previousIndex]?.title} ra khỏi vị trí TOP ${event.previousIndex + 1} bài viết HOT nhất!?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'BỎ QUA',
        confirmButtonText: 'XÁC NHẬN'
      }).then((result) => {
        if (result.isConfirmed) {
          // console.log(event.previousContainer.data[event.previousIndex]?.id);
          if (event.previousContainer.id === "cdk-drop-list-0") {            
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            const data = event.container.data.map(rs => rs?.id);            
            this.updateTopArticle(data);
          }       
          if (event.previousContainer.id === "cdk-drop-list-1") {
            //Remove from top list
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            const data = event.previousContainer.data.map(rs => rs?.id); 
            this.updateTopArticle(data);
            // this.callBack(1, 10, 3);
          }   
        }
      })      
      // console.log(event.container.data);
      // console.log(event.previousContainer);
    }
  }

  onChangeValue(event: any): void {
    console.log(event);
  }

  resetPageModel(): void {            
    this.initPageNumber = 1;  
    this.initPageSize = 10;           
  }

  onPageSizeChange(event: number): void {
    this.initPageSize = event;
    const newValue: PageModel = {
      pageSize: event,
      pageNumber: this.initPageNumber,
      status: 3
    }
    this.paging.emit(newValue);    
  }

  onPageIndexChange(event: number): void {    
    this.initPageNumber = event;    
    const newValue: PageModel = {
      pageSize: this.initPageSize,
      pageNumber: event,
      status: 3
    }
    this.paging.emit(newValue);    
  }
}
