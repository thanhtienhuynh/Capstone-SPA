import { Routes, RouterModule } from '@angular/router';
import { CreateExamComponent, ExamDetailComponent, ExaminationFatherComponent, ExamListBySubjectComponent, ExamListComponent, ExamListFatherComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'examination-list' },
  {
    path: 'examination-list', component: ExaminationFatherComponent,
    data: { breadcrumb: 'Danh Sách Đề Thi Theo Môn'}, 
    children: [
      { path: '', component: ExamListComponent, },
      // {
      //   path: 'examination-list-by-subject/:id', component: ExamListBySubjectComponent, data: { breadcrumb: 'Môn Học'}, 
      //   children : [
      //     {
      //       path: 'subject/:id', component: ExamDetailComponent,
      //       data: {
      //         breadcrumb: 'Chi tiết bài thi'
      //       }, 
      //     }  
      //   ]        
      // },
      {
        path: 'examination-list-by-subject/:id', component: ExamListFatherComponent, data: { breadcrumb: 'Môn Học'}, 
        children : [
          { path: '', component: ExamListBySubjectComponent},
          {
            path: 'subject/:id', component: ExamDetailComponent,
            data: {
              breadcrumb: 'Chi tiết bài thi'
            }, 
          }  
        ]        
      },      
    ]
  }, 
  { path: 'create-exam', component: CreateExamComponent, data: { breadcrumb: 'Tạo Đề Thi'} },
];

export const ExaminationRoutes = RouterModule.forChild(routes);
