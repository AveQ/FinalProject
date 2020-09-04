import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FoodPanelComponent} from '../components/food-panel/food-panel.component';
import {DailyStatisticsComponent} from '../components/food-panel/daily-statistics/daily-statistics.component';
import {SportPanelComponent} from '../components/sport-panel/sport-panel.component';


const routes: Routes = [
  {path: 'food-panel', component: FoodPanelComponent},
  {path: 'food-statistic', component: DailyStatisticsComponent},
  {path: 'sport-panel', component: SportPanelComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
