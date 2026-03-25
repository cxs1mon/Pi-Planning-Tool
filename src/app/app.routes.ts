import { Routes } from '@angular/router';
import { PiContainer } from './pi-container/pi-container';
import { PlanningContainer } from './planning-container/planning-container';
import { SettingsContainer } from './settings-container/settings-container';
import { EmployeeContainer } from './employee-container/employee-container';
import { FeatureContainer } from './feature-container/feature-container';

export const routes: Routes = [
  { path: '', component: PiContainer },
  { path: 'overview/:id', component: PlanningContainer },
  { path: 'settings/:id', component: SettingsContainer },
  { path: 'employees/:id', component: EmployeeContainer },
  { path: 'features/:id', component: FeatureContainer },
  { path: '**', redirectTo: '' },
];
