import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AtlasExercisesComponent} from '../components/atlas-exercises/atlas-exercises.component';
import {AuthComponent} from '../components/auth/auth.component';
import {ExerciseComponent} from '../components/atlas-exercises/exercise/exercise.component';
import {WelcomePageComponent} from '../components/welcome-page/welcome-page.component';
import {FoodPanelNewComponent} from '../components/food--panel/food-panel.component';
import {BMIComponent} from '../components/BMI/bmi.component';
import {TimelineExeComponent} from '../components/food--panel/timeline-exe/timeline-exe.component';
import {AtlasComponent} from '../components/atlas/atlas.component';
import {SettingsComponent} from '../components/settings/settings.component';


const routes: Routes = [
  {path: 'food-panel', component: FoodPanelNewComponent},
  {path: 'atlas-exercises', component: AtlasExercisesComponent},
  {path: 'authorisation', component: AuthComponent},
  {path: 'atlas-exercises/exercise', component: ExerciseComponent},
  {path: 'atlas', component: AtlasComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'bmi', component: BMIComponent},
  {path: 'timeline-exercise', component: TimelineExeComponent},
  {path: '', component: WelcomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
