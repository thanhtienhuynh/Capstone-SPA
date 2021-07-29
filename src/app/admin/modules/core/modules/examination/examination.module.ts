import { NgModule } from '@angular/core';
import { ExaminationRoutes } from './examination.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { CreateExamComponent, ExamDetailComponent, ExaminationFatherComponent, ExamListBySubjectComponent, ExamListComponent, ExamListFatherComponent } from './pages';
import { ViewExamModalComponent } from './components';
import { SafeAdminHtmlPipe } from 'src/app/admin/shared/pipe';


const COMPONENTS = [
  ViewExamModalComponent
];

const PAGES = [
  ExaminationFatherComponent,
  ExamListFatherComponent,
  ExamListComponent,
  ExamListBySubjectComponent,
  CreateExamComponent,
  ExamDetailComponent
];

const PIPE = [  
  SafeAdminHtmlPipe
]
@NgModule({
  imports: [
    SharedModule.forChild(),
    ExaminationRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPE]
})
export class ExaminationModule { }
