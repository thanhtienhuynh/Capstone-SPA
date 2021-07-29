import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit, OnChanges {

  @Input() numericalOrder: number;
  @Input() selectedIndex : number;  
  @Input() isRight : boolean;  
  @Input() isWrong : boolean;  
  isSelected: boolean = false;
  constructor() { }  

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    if (this.numericalOrder === this.selectedIndex) {
      this.isSelected = true;
    }           
  }  

}
