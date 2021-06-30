import { Routes, RouterModule } from '@angular/router';
import { CreateExamComponent, ExamDetailComponent, ExaminationFatherComponent, ExamListComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'examination-list' },
  {
    path: 'examination-list', component: ExaminationFatherComponent,
    data: {
      breadcrumb: 'Danh Sách Đề Thi'
    }, children: [
      { path: '', component: ExamListComponent, },
      {
        path: 'details/:id', component: ExamDetailComponent,
        data: {
          breadcrumb: 'Chi Tiết Đề Thi'
        }
      },
    ]
  }, 
  { path: 'create-exam', component: CreateExamComponent, data: { breadcrumb: 'Tạo Đề Thi'} },
];

export const ExaminationRoutes = RouterModule.forChild(routes);
