import { Routes, RouterModule } from '@angular/router';
import { ArticleDetailComponent, ArticleMainComponent, ArticleMainFatherComponent, CreateArticleComponent, PublishedComponent } from './pages';
import { CensorshipComponent } from './pages/censorship/censorship.component';

const routes: Routes = [
  { path: '', redirectTo: 'article-list'},
  { path: 'article-list', component: ArticleMainFatherComponent,
    data: {
      breadcrumb: 'Danh sách bài viết'
    },
    children: [
      {
        path: '', component: ArticleMainComponent
      },
      {
        path: 'details/:id', component: ArticleDetailComponent,
        data: {
          breadcrumb: 'Chi tiết bài viết'
        }
      },
    ]
  },
  {
    path: 'censor', component: CensorshipComponent,
    data: {
      breadcrumb: 'Duyệt bài hàng loạt'
    }
  },
  {
    path: 'published', component: PublishedComponent,
    data: {
      breadcrumb: 'Đăng bài hàng loạt'
    }
  },
  {
    path: 'create-article', component: CreateArticleComponent,
    data: {
      breadcrumb: 'Tạo bài viết'
    }
  },
];

export const ArticleRoutes = RouterModule.forChild(routes);
