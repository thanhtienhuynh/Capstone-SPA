import { NgModule } from '@angular/core';
import { UniversityRoutes } from './university.routing';
import { UniDetailComponent, UniversityDetailComponent, UniversityMainComponent } from './pages';
import { ActionMajorModalComponent, CreateMajorModalComponent, CreateUniversityModalComponent, UniversityDetailModalComponent } from './components/modals';
import { SharedModule } from 'src/app/admin/shared/shared.module';

const COMPONENTS = [
  CreateUniversityModalComponent,
  // CreateMajorModalComponent,  
  ActionMajorModalComponent
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
