import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [     
      {path: '', redirectTo: 'university'},
      {
        path: 'dashboard', loadChildren: () => import('src/app/admin/modules/core/modules').then(m => m.DashboardModule),
      }, 
      {
        path: 'university',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.UniversityModule),
        data: {
          breadcrumb: 'Trường Học'
        }
      },
      {
        path: 'article',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.ArticleModule),
        data: {
          breadcrumb: 'Bài Viết'
        }
      },
      {
        path: 'major-configuration',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.MajorConfigurationModule),
        data: {
          breadcrumb: 'Ngành Học'
        }
      },
    ]
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
