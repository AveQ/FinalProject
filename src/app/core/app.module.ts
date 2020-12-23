import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LazyLoadingComponent} from '../components/lazy-loading/lazyloading.component';
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
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import {LoadingSpinnerComponent} from '../loading-spinner/loading-spiner.component';
import {AuthGuard} from '../services/authGuard.service';
import {FooterComponent} from '../components/footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    LazyLoadingComponent,
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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
  ],
  providers: [
    NavigationService,
    AuthGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '737028786321-aan5aur7fdd54humj4enqqk9jndbvsn3.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
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
