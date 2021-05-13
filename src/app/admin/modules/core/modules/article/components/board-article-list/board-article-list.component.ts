import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ArticleVM } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'board-article-list',
  templateUrl: './board-article-list.component.html',
  styleUrls: ['./board-article-list.component.scss']
})
export class BoardArticleListComponent implements OnInit, OnChanges {

  @Input() listOfArticle: ArticleVM[];
  @Input() landTitle: string;
  @Input() action: string;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<any[]>) {   
    console.log(event)    ;
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      if (event.container.id === "cdk-drop-list-0") {
        // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);    
      }
      if (event.container.id === "cdk-drop-list-1") {
        Swal.fire({
          title: 'Are you sure?',
          text: "aslkdjg",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'XÁC NHẬN'
        }).then((result) => {
          if (result.isConfirmed) {            
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);    
          }
        }) 
      }           
    }
    else {
      Swal.fire({
        title: 'Are you sure?',
        text: event.previousContainer.id === "cdk-drop-list-0" ? "Bạn muốn di chuyển từ cột 0 sang 1" : "Bạn muốn di chuyển từ cột 1 sang 0",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(event.previousContainer.data[event.previousIndex]?.id);
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          )
        }
      })      
      // console.log(event.container.data);
      // console.log(event.previousContainer);
    }
  }
}
