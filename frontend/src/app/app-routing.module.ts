import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoiSettingsComponent } from './roi-settings/roi-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [ { path: "", component: DashboardComponent },
                          {path: "detailed", component: DetailsComponent},
                        { path: "settings", component: RoiSettingsComponent }
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
