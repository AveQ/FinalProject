import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FoodPanelComponent} from '../components/food-panel/food-panel.component';
import {DailyStatisticsComponent} from '../components/food-panel/daily-statistics/daily-statistics.component';
import {AtlasExercisesComponent} from '../components/atlas-exercises/atlas-exercises.component';
import {AuthComponent} from '../components/auth/auth.component';
import {ExerciseComponent} from '../components/atlas-exercises/exercise/exercise.component';
import {WelcomePageComponent} from '../components/welcome-page/welcome-page.component';


const routes: Routes = [
  {path: 'food-panel', component: FoodPanelComponent},
  {path: 'food-statistic', component: DailyStatisticsComponent},
  {path: 'atlas-exercises', component: AtlasExercisesComponent},
  {path: 'authorisation', component: AuthComponent},
  {path: 'atlas-exercises/exercise', component: ExerciseComponent},
  {path: '', component: WelcomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
