import { Routes } from '@angular/router';
import { PiContainer } from './pi-container/pi-container';
import { PlanningContainer } from './planning-container/planning-container';
import { PiSettings } from './pi-settings/pi-settings';

export const routes: Routes = [
  { path: '', component: PiContainer },
  { path: 'overview', component: PlanningContainer },
  { path: 'settings', component: PiSettings },
];
