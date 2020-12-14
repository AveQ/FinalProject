import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LazyLoadingComponent} from '../components/lazy-loading/lazyloading.component';
import {ChartsModule} from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthComponent} from '../components/auth/auth.component';
import {ReactiveFormsModule} from '@angular/forms';
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
import {BMIComponent} from '../components/BMI/bmi.component';
import {TimelineExeComponent} from '../components/food--panel/timeline-exe/timeline-exe.component';
import {AtlasComponent} from '../components/atlas/atlas.component';
import {SettingsComponent} from '../components/settings/settings.component';
import {AirComponent} from '../components/air/air.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NFLInterceptorService} from '../services/NFLInterceptorService.service';

@NgModule({
  declarations: [
    AppComponent,
    LazyLoadingComponent,
    AuthComponent,
    WelcomePageComponent,
    NavComponent,
    FoodPanelNewComponent,
    WChartComponent,
    TrainingComponent,
    NgbdTableBasic,
    StatsComponent,
    MealComponent,
    BMIComponent,
    TimelineExeComponent,
    AtlasComponent,
    SettingsComponent,
    AirComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    NavigationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NFLInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
