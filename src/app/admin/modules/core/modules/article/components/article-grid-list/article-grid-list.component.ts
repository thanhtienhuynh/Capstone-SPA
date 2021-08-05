import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM, PageModel } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';
import { ArticleContentModalComponent } from '../modals/article-content-modal/article-content-modal.component';

@Component({
  selector: 'app-article-grid-list',
  templateUrl: './article-grid-list.component.html',
  styleUrls: ['./article-grid-list.component.scss']
})
export class ArticleGridListComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() listOfArticle: ArticleVM[];
  @Input() status: number;
  @Input() totalRecods: number = 0;
  @Input() isLoadingArticle: boolean;
  @Output() paging = new EventEmitter();
  @Output() searchValueTitle: EventEmitter<any> = new EventEmitter<any>();

  
  initPageSize: number = 8;
  initPageNumber: number = 1;
  isCrawling: boolean = false;
  visible = false;
  searchValueName: string = '';
  constructor(
    private _articleService: ArticleService,
    private _modalService: NzModalService,
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
  }

  searchByTitle(): void {
    this.searchValueTitle.emit({ title: this.searchValueName, status: this.status })
  }

  resetSearchField(): void {
    this.searchValueName = '';
    this.searchValueTitle.emit({ title: this.searchValueName, status: this.status })
  }

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

  openContentModal(articleId: number | string): void {
    this._modalService.create({
      nzContent: ArticleContentModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 1024,
      nzComponentParams: { articleId: articleId },
    })
  }


  crawlArticle(): void {
    this.isCrawling = true;
    this._articleService.crawlArticle({}).pipe(
      tap(rs => {
        if (rs.succeeded === true) {
          this.isCrawling = false;
          const newValue: PageModel = {
            pageSize: this.initPageSize,
            pageNumber: this.initPageNumber,
            status: this.status
          }
          this.paging.emit(newValue);
          Swal.fire('Crawl thành công', `${rs.data}`, 'success');
        } else {
          this.isCrawling = false;
          Swal.fire('Crawl thất bại', `${rs.data}`, 'error');
        }
      })
    ).subscribe();
  }
}
