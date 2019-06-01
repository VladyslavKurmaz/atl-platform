import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { BindComponent } from './pages/bind/bind.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GoalsComponent } from './pages/goals/goals.component';
import { FlowsComponent } from './pages/flows/flows.component';
import { DocsComponent } from './pages/docs/docs.component';
import { AppsComponent } from './pages/apps/apps.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'bind', component: BindComponent },
  { path: 'home', component: HomeComponent/*, canActivate: [AuthGuardService]*/ },
  { path: 'contacts', component: ContactsComponent/*, canActivate: [AuthGuardService]*/ },
  { path: 'goals', component: GoalsComponent/*, canActivate: [AuthGuardService]*/ },
  { path: 'flows', component: FlowsComponent/*, canActivate: [AuthGuardService]*/ },
  { path: 'docs', component: DocsComponent/*, canActivate: [AuthGuardService]*/ },
  { path: 'apps', component: AppsComponent/*, canActivate: [AuthGuardService]*/ },
  { path: 'settings', component: SettingsComponent/*, canActivate: [AuthGuardService]*/ },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(routes);
