import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ArticleVM, BoardData, PageModel } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'board-article-list',
  templateUrl: './board-article-list.component.html',
  styleUrls: ['./board-article-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class BoardArticleListComponent implements OnInit, OnChanges {

  @Input() unFilterArticles: ArticleVM[];
  @Input() listOfArticle: ArticleVM[];
  @Input() laneTitle: string;
  @Input() laneId: string;

  @Output() callParent = new EventEmitter<BoardData>();
  @Output() submitData = new EventEmitter<BoardData>();
  @Output() search = new EventEmitter<BoardData>();

  visible = false;
  searchValueName: string = '';
  pageSize: number = 5;
  pageIndex: number = 1;
  total = 1;
  listOfDisplayArticle: ArticleVM[] = [];
  constructor(    
  ) { }  

  ngOnChanges(changes: SimpleChanges): void {    
    // console.log(this.listOfArticle, this.laneTitle, 'onChange');
    this.listOfDisplayArticle = [...this.listOfArticle];
    this.total = this.listOfDisplayArticle.length;
  }

  ngOnInit() {
    // console.log(this.listOfArticle, this.laneTitle,'onInit');
    // console.log(this.listOfDisplayArticle);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {        
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;                 
  }

  getTopNumber(currentIndex: number): number {
    this.listOfArticle.map((rs, index) => {

    })
    return 1;
  }


  // drop(event: CdkDragDrop<any[]>) {     
  //   console.log(event);  
  //   let isMovingInsideTheSameList = event.previousContainer === event.container;
  //   if (isMovingInsideTheSameList) {
  //     if (event.container.id === "search") {

  //     }
  //     if (event.container.id === "save") {
  //       if (event.currentIndex !== event.previousIndex) {
  //         Swal.fire({
  //           title: 'CHỦ Ý',
  //           html: `Điều chỉnh bài viết <b>"${event.container.data[event.previousIndex]?.title}"</b> từ TOP ${event.previousIndex + 1} --> TOP ${event.currentIndex + 1} bài viết HOT nhất!?`,
  //           icon: 'question',
  //           showCancelButton: true,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           cancelButtonText: 'BỎ QUA',
  //           confirmButtonText: 'XÁC NHẬN'
  //         }).then((result) => {
  //           if (result.isConfirmed) {            
  //             moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);   
  //             const data = event.container.data.map(rs => rs?.id);                      
  //             this.callParent.emit(data);           
  //           }
  //         }) 
  //       }        
  //       // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);  
  //     }           
  //   }
  //   else {
  //     Swal.fire({
  //       title: event.previousContainer.id === "search" ? 'CHÚ Ý' : 'CẢNH BÁO',
  //       html: event.previousContainer.id === "search" 
  //       ? `Thiết lập bài viết <b>"${event.previousContainer.data[event.previousIndex]?.title}"</b> làm TOP ${event.currentIndex + 1} bài viết HOT nhất!?` 
  //       : `Điều chỉnh bài viết <b>"${event.previousContainer.data[event.previousIndex]?.title}"</b> ra khỏi vị trí TOP ${event.previousIndex + 1} bài viết HOT nhất!?`,
  //       icon: event.previousContainer.id === "search" ? 'question' : 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       cancelButtonText: 'BỎ QUA',
  //       confirmButtonText: 'XÁC NHẬN'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // console.log(event.previousContainer.data[event.previousIndex]?.id);
  //         if (event.previousContainer.id === "search") {            
  //           transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //           const data = event.container.data.map(rs => rs?.id);                
  //           this.callParent.emit(data);                     
  //         }       
  //         if (event.previousContainer.id === "save") {
  //           //Remove from top list
  //           transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //           const data = event.previousContainer.data.map(rs => rs?.id);             
  //           this.callParent.emit(data);             
  //         }   
  //       }
  //     })      
  //     // console.log(event.container.data);
  //     // console.log(event.previousContainer);
  //   }
  // }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
    const newArticle = { ...event.item.data };
    const newArticles = [...event.container.data];
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      if (event.container.id === "published") {

      };
      if (event.container.id === "top") {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        // const publishedData = undefined;
        const topData = event.container.data;
        this.callParent.emit({ topData: topData } as BoardData);        
      };
    } else {
      if (event.previousContainer.id === "top") {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        const publishedData = event.container.data;
        const topData = event.previousContainer.data;
        this.callParent.emit({ publisedData: publishedData, topData: topData } as BoardData);
      };
      if (event.previousContainer.id === "published") {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        const publishedData = event.previousContainer.data;
        const topData = event.container.data;
        this.callParent.emit({ publisedData: publishedData, topData: topData } as BoardData);
      }
    }    
  }
 




  articleFilter(event: string): void {
    console.log(event);
    if (this.laneId !== 'published') {
      return;
    };
    if (event.toLocaleLowerCase() !== "") {
      const publishedData = this.unFilterArticles.filter(rs => rs.title.toLocaleLowerCase().includes(event.toLocaleLowerCase()));           
      this.search.emit({ publisedData: publishedData });
      return;
    };    
    this.search.emit({publisedData: undefined});    
  }

  resetSearchField(): void {
    this.searchValueName = '';
    this.articleFilter(this.searchValueName);
  }



  apply(): void {
    if (this.laneId !== 'top') {
      return;
    };
    Swal.fire({
      title: 'CẢNH BÁO',
      text: 'Lưu mới danh sách TOP bài viết vào hệ thống',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'BỎ QUA',
      confirmButtonText: 'XÁC NHẬN'
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitData.emit({ topData: this.listOfArticle });
      }
    });
  }


  resetTopArticle(): void {
    Swal.fire({
      title: 'CẢNH BÁO',
      text: 'Danh sách TOP bài viết sẽ được tạo mới',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'BỎ QUA',
      confirmButtonText: 'XÁC NHẬN'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callParent.emit({ topData: [] });
      }
    });
  }
}
