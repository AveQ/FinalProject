import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LazyLoadingComponent} from '../components/lazy-loading/lazyloading.component';
import {ChartsModule} from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AtlasExercisesComponent} from '../components/atlas-exercises/atlas-exercises.component';
import {AuthComponent} from '../components/auth/auth.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ExerciseComponent} from '../components/atlas-exercises/exercise/exercise.component';
import {WelcomePageComponent} from '../components/welcome-page/welcome-page.component';
import {NavComponent} from '../components/nav/nav.component';
import {FoodPanelNewComponent} from '../components/food--panel/food-panel.component';
import {WChartComponent} from '../components/food--panel/wChart/wChart.component';
import {TrainingComponent} from '../components/food--panel/training/training.component';
import {
  NgbdTableBasic
} from '../components/food--panel/training/table/table.component';
import {StatsComponent} from '../components/food--panel/stats/stats.component';
import {MealComponent} from '../components/food--panel/meal/meal.component';
import {NavigationService} from '../services/navigation.service';


@NgModule({
  declarations: [
    AppComponent,
    LazyLoadingComponent,
    AtlasExercisesComponent,
    AuthComponent,
    ExerciseComponent,
    WelcomePageComponent,
    NavComponent,
    FoodPanelNewComponent,
    WChartComponent,
    TrainingComponent,
    NgbdTableBasic,
    StatsComponent,
    MealComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [NavigationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
