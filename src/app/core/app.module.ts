import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChartsModule} from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthComponent} from '../components/auth/auth.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WelcomePageComponent} from '../components/welcome-page/welcome-page.component';
import {NavComponent} from '../components/nav/nav.component';
import {FoodPanelNewComponent} from '../components/food--panel/food-panel.component';
import {WChartComponent} from '../components/food--panel/wChart/wChart.component';
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

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {LoadingSpinnerComponent} from '../loading-spinner/loading-spiner.component';
import {AuthGuard} from '../services/authGuard.service';
import {FooterComponent} from '../components/footer/footer.component';
import {AdminPanelComponent} from '../components/admin-panel/admin-panel.component';
import {AuthGuardAdmin} from '../services/authGuardAdmin.service';
import {ModalComponent} from '../components/modal/modal.component';
import {ExerciseComponent} from '../components/atlas/exercise/exercise.component';
import {KnowledgeComponent} from '../components/atlas/knowledge/knowledge.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    WelcomePageComponent,
    NavComponent,
    FoodPanelNewComponent,
    WChartComponent,
    StatsComponent,
    MealComponent,
    BMIComponent,
    TimelineExeComponent,
    AtlasComponent,
    SettingsComponent,
    AirComponent,
    LoadingSpinnerComponent,
    FooterComponent,
    AdminPanelComponent,
    ModalComponent,
    ExerciseComponent,
    KnowledgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    NavigationService,
    AuthGuard,
    AuthGuardAdmin,
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
