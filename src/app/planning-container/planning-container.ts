import { Component } from '@angular/core';
import { PlanningOverview } from '../planning-overview/planning-overview';

@Component({
  selector: 'app-planning-container',
  imports: [PlanningOverview],
  templateUrl: './planning-container.html',
  styleUrl: './planning-container.scss',
})
export class PlanningContainer {}
