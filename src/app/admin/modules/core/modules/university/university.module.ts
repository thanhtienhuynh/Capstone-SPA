import { NgModule } from '@angular/core';
import { UniversityRoutes } from './university.routing';
import { UniDetailComponent, UniversityMainComponent, UniversityMainFatherComponent } from './pages';
import { ActionMajorModalComponent, CreateUniversityModalComponent, DeactiveUniversityModalComponent, DeleteMajorModalComponent } from './components/modals';
import { SharedModule } from 'src/app/admin/shared/shared.module';

const COMPONENTS = [
  CreateUniversityModalComponent,  
  ActionMajorModalComponent,
  DeleteMajorModalComponent,
  DeactiveUniversityModalComponent
];

const PAGES = [
  UniversityMainFatherComponent,
  UniversityMainComponent,
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
