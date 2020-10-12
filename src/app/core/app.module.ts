import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LazyLoadingComponent} from '../components/lazy-loading/lazyloading.component';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {UserService} from '../components/services/user.service';
import {NavigationService} from '../components/services/navigation.service';
import {FoodPanelComponent} from '../components/food-panel/food-panel.component';
import {DailyStatisticsComponent} from '../components/food-panel/daily-statistics/daily-statistics.component';
import {ChartsModule} from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AddFoodPanelComponent} from '../components/food-panel/add-food-modal/add-food-panel.component';
import {MealsService} from '../components/services/meals.service';
import {AtlasExercisesComponent} from '../components/atlas-exercises/atlas-exercises.component';
import {AuthComponent} from '../components/auth/auth.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ExerciseComponent} from '../components/atlas-exercises/exercise/exercise.component';


@NgModule({
  declarations: [
    AppComponent,
    LazyLoadingComponent,
    NavbarComponent,
    SidebarComponent,
    FoodPanelComponent,
    DailyStatisticsComponent,
    AddFoodPanelComponent,
    AtlasExercisesComponent,
    AuthComponent,
    ExerciseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [UserService, NavigationService, MealsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
