import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FoodPanelComponent} from '../components/food-panel/food-panel.component';
import {DailyStatisticsComponent} from '../components/food-panel/daily-statistics/daily-statistics.component';


const routes: Routes = [
  {path: 'food-panel', component: FoodPanelComponent},
  {path: 'food-statistic', component: DailyStatisticsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
