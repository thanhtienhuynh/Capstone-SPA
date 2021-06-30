import { NgModule } from '@angular/core';
import { ExaminationRoutes } from './examination.routing';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { CreateExamComponent, ExaminationFatherComponent, ExamListComponent } from './pages';
import { ViewExamModalComponent } from './components';

const COMPONENTS = [
  ViewExamModalComponent
];

const PAGES = [
  ExaminationFatherComponent,
  ExamListComponent,
  CreateExamComponent
]
@NgModule({
  imports: [
    SharedModule.forChild(),
    ExaminationRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class ExaminationModule { }
