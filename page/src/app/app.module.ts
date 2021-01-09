import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BecariosComponent } from './becarios/becarios.component';
import { TareasComponent } from './tareas/tareas.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TerminarComponent } from './terminar/terminar.component';
import { AppService } from './app.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'becarios',
    component: BecariosComponent,
  },
  {
    path: 'tareas',
    component: TareasComponent,
  },
  {
    path: 'terminar/:id',
    component: TerminarComponent,
  },
  {
    path: '**',
    redirectTo: 'becarios',
    pathMatch: 'full',
  }
]
@NgModule({
  declarations: [
    AppComponent,
    BecariosComponent,
    TareasComponent,
    TerminarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
