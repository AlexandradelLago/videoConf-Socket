import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home/home.component';
import {VisualizarComponent} from './home/visualizar/visualizar.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'visualizar',  component: VisualizarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
