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


const routes: Routes = [
  // {path: 'food-panel', component: FoodPanelNewComponent},
  {path: 'food-panel/:active', canActivate: [AuthGuard], component: FoodPanelNewComponent},
  {path: 'authorisation', component: AuthComponent},
  {path: 'atlas', canActivate: [AuthGuard], component: AtlasComponent},
  {path: 'atlas/:active', canActivate: [AuthGuard], component: AtlasComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'bmi', component: BMIComponent},
  {path: 'air', component: AirComponent},
  {path: 'timeline-exercise', canActivate: [AuthGuard], component: TimelineExeComponent},
  {path: 'admin-panel', canActivate: [AuthGuardAdmin], component: AdminPanelComponent},
  {path: '', component: WelcomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
