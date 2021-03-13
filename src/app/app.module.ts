import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SitiosComponent } from './components/sitios/sitios.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps'
import { AgmDirectionModule } from 'agm-direction';
@NgModule({
  declarations: [
    AppComponent,
    SitiosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    GoogleMapsModule,    
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDBNR37FRIeI7ixrWSOFK9QF_SkM9WVTMc'
    }),
    AgmDirectionModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
