import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SitiosComponent } from './components/sitios/sitios.component';

const routes: Routes = [
  {path : '', component : SitiosComponent}, 
  {path : '**', component : SitiosComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
