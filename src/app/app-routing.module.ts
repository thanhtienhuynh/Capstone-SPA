import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamPageComponent } from './major-suggestion-stepper/exam-page/exam-page.component';
import { StepperComponent } from './major-suggestion-stepper/stepper/stepper.component';
// import { TestResolverService } from './_resolver/exam-resolver.service';

// const appRoutes: Routes = [
//   { path: '', redirectTo: '/recipes', pathMatch: 'full' },
//   { path: 'stepper', component: RecipesComponent, children: [
//     { path: '', component: RecipeStartComponent },
//     { path: 'new', component: RecipeEditComponent },
//     { path: ':id', component: RecipeDetailComponent },
//     { path: ':id/edit', component: RecipeEditComponent },
//   ] },
//   { path: 'shopping-list', component: ShoppingListComponent },
// ];

const appRoutes: Routes = [
  { path: '', redirectTo: '/stepper', pathMatch: 'full' },
  { path: 'stepper', component: StepperComponent},
  { path: 'exam-test/:id', component: ExamPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
