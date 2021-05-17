import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ArticleVM } from 'src/app/admin/view-models';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit, OnChanges {

  @Input() article: ArticleVM;
  @Input() topNumber: number;

  isLoading: boolean = true;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit() {
  }


}
