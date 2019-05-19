import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { Routing } from './app.routing';

import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AppsComponent } from './pages/apps/apps.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { GoalsComponent } from './pages/goals/goals.component';
import { FlowsComponent } from './pages/flows/flows.component';
import { DocsComponent } from './pages/docs/docs.component';
import { BindComponent } from './pages/bind/bind.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ContactsComponent,
    LandingComponent,
    AppsComponent,
    SettingsComponent,
    GoalsComponent,
    FlowsComponent,
    DocsComponent,
    BindComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Routing,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
