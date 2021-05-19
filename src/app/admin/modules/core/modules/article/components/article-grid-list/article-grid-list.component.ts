import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, PageModel } from 'src/app/admin/view-models';

@Component({
  selector: 'app-article-grid-list',
  templateUrl: './article-grid-list.component.html',
  styleUrls: ['./article-grid-list.component.scss']
})
export class ArticleGridListComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() listOfArticle: ArticleVM[];
  @Input() status: number;
  @Input() totalRecods: number = 0;
  @Output() paging = new EventEmitter();
  @Output() searchValueTitle: EventEmitter<string> = new EventEmitter<string>();

  initPageSize: number = 8;
  initPageNumber: number = 1;

  constructor(
    private _articleService: ArticleService,
  ) { }

  ngAfterViewInit(): void {
    // this.paginationTemp.nzPageIndex = 1;  
  }
  
  ngOnChanges(changes: SimpleChanges): void {        
    
  }

  ngOnInit() {    
    
  }

  // searchByTitle(status?: number): void {
  //   this._articleService.searchByTitle(1, 10, status, )
  // }

  onPageSizeChange(event: number): void {
    this.initPageSize = event;
    if (this.status !== undefined) {
      const newValue: PageModel = {
        pageSize: event,
        pageNumber: this.initPageNumber,
        status: this.status
      }
      this.paging.emit(newValue);
    }
  }

  resetPageModel(): void {        
    // this.paginationTemp.nzPageIndex = 1;     
    this.initPageNumber = 1;      
    this.initPageSize = 8;       
  }

  onPageIndexChange(event: number): void {    
    this.initPageNumber = event;
    if (this.status !== undefined) {
      const newValue: PageModel = {
        pageSize: this.initPageSize,
        pageNumber: event,
        status: this.status
      }
      this.paging.emit(newValue);
    }
  }
}
