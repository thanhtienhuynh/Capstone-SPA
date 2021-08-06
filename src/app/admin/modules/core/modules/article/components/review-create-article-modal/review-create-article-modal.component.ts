import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/admin/services/article';
import { ArticleCM } from 'src/app/admin/view-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-create-article-modal',
  templateUrl: './review-create-article-modal.component.html',
  styleUrls: ['./review-create-article-modal.component.scss']
})
export class ReviewCreateArticleModalComponent implements OnInit {

  @Input() data: ArticleCM;
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
    formData.append('Title', this.data.Title);
    formData.append('ShortDescription', this.data.ShortDescription);
    formData.append('Content', this.data.Content);
    formData.append('PostImage', this.data.PostImage);
    for (let i = 0; i < this.data.UniversityIds.length; i++) {
      const element = this.data.UniversityIds[i];
      formData.append('UniversityIds', element.toString())
    }
    for (let i = 0; i < this.data.MajorIds.length; i++) {
      const element = this.data.MajorIds[i];
      formData.append('MajorIds', element.toString())
    }    

    this._articleService.createArticle(formData).pipe(
      tap(rs => {        
        if (rs.succeeded === true) {
          this.isLoading = false;
          Swal.fire('Thành công', 'Tạo mới bài viết thành công, bài viết được chuyển vào danh mục các bài viết chờ duyệt', 'success');
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
