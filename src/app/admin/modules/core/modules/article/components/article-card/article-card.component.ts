import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleVM } from 'src/app/admin/view-models';
import { ArticleContentModalComponent } from '..';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit, OnChanges {

  @Input() article: ArticleVM;
  @Input() topNumber: number;

  isLoading: boolean = true;

  constructor(
    private _modalService: NzModalService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
  }

  openContentModal(articleId?: number | string): void {
    console.log(articleId);
    this._modalService.create({
      nzContent: ArticleContentModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 1024,
      nzComponentParams: { articleId: articleId },
    })
  }
}
