import { NgModule } from '@angular/core';
import { SeasonRoutes } from './season.routing';
import { SeasonMainComponent, SeasonMainFatherComponent } from './pages';
import { SharedModule } from 'src/app/admin/shared/shared.module';
import { CreateSeasonModalComponent, UpdateSeasonModalComponent } from './components';

const COMPONENTS = [
  CreateSeasonModalComponent,
  UpdateSeasonModalComponent
];

const PAGES = [
  SeasonMainFatherComponent,
  SeasonMainComponent
]
@NgModule({
  imports: [
    SharedModule.forChild(),
    SeasonRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class SeasonModule { }
