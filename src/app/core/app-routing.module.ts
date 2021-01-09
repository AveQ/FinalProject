import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from '../components/auth/auth.component';
import {WelcomePageComponent} from '../components/welcome-page/welcome-page.component';
import {FoodPanelNewComponent} from '../components/food--panel/food-panel.component';
import {BMIComponent} from '../components/BMI/bmi.component';
import {TimelineExeComponent} from '../components/food--panel/timeline-exe/timeline-exe.component';
import {AtlasComponent} from '../components/atlas/atlas.component';
import {SettingsComponent} from '../components/settings/settings.component';
import {AirComponent} from '../components/air/air.component';
import {AuthGuard} from '../services/authGuard.service';
import {AuthGuardAdmin} from '../services/authGuardAdmin.service';
import {AdminPanelComponent} from '../components/admin-panel/admin-panel.component';
import {ExerciseComponent} from '../components/atlas/exercise/exercise.component';
import {KnowledgeComponent} from '../components/atlas/knowledge/knowledge.component';
import {PageNotFoundComponent} from '../components/page-not-found/page-not-found.component';


const routes: Routes = [
  // {path: 'food-panel', component: FoodPanelNewComponent},
  {path: 'food-panel/:active', canActivate: [AuthGuard], component: FoodPanelNewComponent},
  {path: 'authorisation', component: AuthComponent},
  {path: 'atlas/exercises/:page', canActivate: [AuthGuard], component: AtlasComponent },
  {path: 'atlas/knowledge', canActivate: [AuthGuard], component: KnowledgeComponent, children: [
      {path: ':part', canActivate: [AuthGuard], component: KnowledgeComponent}
    ] },
  {path: 'exercise/:active', canActivate: [AuthGuard], component: ExerciseComponent},
  {path: 'settings', canActivate: [AuthGuard], component: SettingsComponent},
  {path: 'bmi', canActivate: [AuthGuard], component: BMIComponent},
  {path: 'air', canActivate: [AuthGuard], component: AirComponent},
  {path: 'timeline-exercise', canActivate: [AuthGuard], component: TimelineExeComponent},
  {path: 'admin-panel', canActivate: [AuthGuardAdmin], component: AdminPanelComponent},
  {path: '', component: WelcomePageComponent},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
