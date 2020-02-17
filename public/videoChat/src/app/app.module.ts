import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import {SocketIoModule} from 'ngx-socket-io';
import { HomeComponent } from './home/home/home.component';
import { VisualizarComponent } from './home/visualizar/visualizar.component';

//import { AudioContextModule } from 'angular-audio-context';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VisualizarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot({ url: environment.chat.socket, options: {} }),
   // AudioContextModule.forRoot('balanced')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



