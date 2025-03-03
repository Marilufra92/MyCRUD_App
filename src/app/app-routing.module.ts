import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaImpiegatiComponent } from './lista-impiegati/lista-impiegati.component';
import { ListaUfficiComponent } from './lista-uffici/lista-uffici.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'impiegati', component: ListaImpiegatiComponent },
  { path: 'uffici', component: ListaUfficiComponent },
  { path: 'home', component: HomeComponent },  
  { path: '', redirectTo: '/home', pathMatch: 'full' } //  Redirect della root a home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
