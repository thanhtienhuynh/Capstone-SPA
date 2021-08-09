import { Routes, RouterModule } from '@angular/router';
import { IsAdminGuard } from '../../guards/is-admin.guard';
import { LayoutComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'university', pathMatch: 'full'},
      {
        path: 'dashboard', loadChildren: () => import('src/app/admin/modules/core/modules').then(m => m.DashboardModule),
      },
      {
        path: 'university',
        canActivate: [IsAdminGuard],
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.UniversityModule),
        data: {
          breadcrumb: 'Trường học'
        }
      },
      {
        path: 'article',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.ArticleModule),
        data: {
          breadcrumb: 'Bài viết'
        }
      },
      {
        path: 'major-configuration',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.MajorConfigurationModule),
        data: {
          breadcrumb: 'Ngành học'
        }
      },
      {
        path: 'examination',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.ExaminationModule),
        data: {
          breadcrumb: 'Đề thi'
        }
      },
      {
        path: 'season',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.SeasonModule),
        data: {
          breadcrumb: 'Season'
        }
      },
      {
        path: 'configuration',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.ConfigurationModule),
        data: {
          breadcrumb: 'Cấu hình'
        }
      },
      {
        path: 'users',
        loadChildren: () => import('src/app/admin/modules/core/modules').then((m) => m.UsersModule),
        data: {
          breadcrumb: 'Người dùng'
        }
      },
    ]
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
