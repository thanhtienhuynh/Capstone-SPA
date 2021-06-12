import { NgModule } from '@angular/core';
import { UniversityRoutes } from './university.routing';
import { UniDetailComponent, UniversityMainComponent } from './pages';
import { ActionMajorModalComponent, CreateUniversityModalComponent, DeleteMajorModalComponent } from './components/modals';
import { SharedModule } from 'src/app/admin/shared/shared.module';

const COMPONENTS = [
  CreateUniversityModalComponent,
  // CreateMajorModalComponent,  
  ActionMajorModalComponent,
  DeleteMajorModalComponent
];

const PAGES = [
  UniversityMainComponent,
  // UniversityDetailComponent,
  // UniversityDetailModalComponent,
  UniDetailComponent
]
@NgModule({
  imports: [
    SharedModule.forChild(),
    UniversityRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class UniversityModule { }
