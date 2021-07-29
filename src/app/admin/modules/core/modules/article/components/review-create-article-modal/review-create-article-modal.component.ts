import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-create-article-modal',
  templateUrl: './review-create-article-modal.component.html',
  styleUrls: ['./review-create-article-modal.component.scss']
})
export class ReviewCreateArticleModalComponent implements OnInit {

  @Input() data: any;
  @Input() majors: any;
  @Input() university: any;
  @Input() callBack: () => void;

  isLoading: boolean = false;
  constructor(
    private _articleService: ArticleService,
    private _nzModalRef: NzModalRef
  ) { }

  ngOnInit() {    
  }

  closeModal(): void {
    this._nzModalRef.close();
  }

  createArticle(): void {
    if (this.data === undefined) {
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    for (let key in this.data) {
      formData.append(key, this.data[key]);
    }
    this._articleService.createArticle(formData).pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoading = false;
          Swal.fire('Thành công', 'Tạo mới bài viết thành công', 'success');
          this.callBack();
          this.closeModal();
        } else {
          this.isLoading = false;
          Swal.fire('Lỗi', `${rs.errors[0]}`, 'error');
        }
      })
    ).subscribe();
  }

}
