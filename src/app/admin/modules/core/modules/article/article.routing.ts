import { Routes, RouterModule } from '@angular/router';
import { ArticleDetailComponent, ArticleMainComponent, ArticleMainFatherComponent, PublishedComponent } from './pages';
import { CensorshipComponent } from './pages/censorship/censorship.component';

const routes: Routes = [
  { path: '', redirectTo: 'article-list'},
  { path: 'article-list', component: ArticleMainFatherComponent,
    data: {
      breadcrumb: 'Danh Sách Bài Viết'
    }, 
    children: [
      {
        path: '', component: ArticleMainComponent
      },
      {
        path: 'details/:id', component: ArticleDetailComponent,
        data: {
          breadcrumb: 'Chi Tiết Bài Viết'
        }
      },
    ]
  },  
  {
    path: 'censor', component: CensorshipComponent,
    data: {
      breadcrumb: 'Duyệt Bài Hàng Loạt'
    }
  },
  {
    path: 'published', component: PublishedComponent,
    data: {
      breadcrumb: 'Đăng Bài Hàng Loạt'
    }
  },
];

export const ArticleRoutes = RouterModule.forChild(routes);
