import { Component, input } from '@angular/core';
import { PlanningData } from '../../../Model/planning-data-model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-planning-overview',
  imports: [NgClass],
  templateUrl: './planning-overview.html',
  styleUrl: './planning-overview.scss',
})
export class PlanningOverview {
  feData = input<PlanningData>({
    effort: 0,
    capacity: 0,
    remaining: 0,
    status: 'optimal ausgelastet',
  });

  beData = input<PlanningData>({
    effort: 0,
    capacity: 0,
    remaining: 0,
    status: 'optimal ausgelastet',
  });

  statusList = [
    {
      title: 'Backend',
      data: this.beData,
    },
    {
      title: 'Frontend',
      data: this.feData,
    },
  ];

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'überplant':
        return 'status__tag--over';
      case 'unterplant':
        return 'status__tag--under';
      case 'optimal ausgelastet':
        return 'status__tag--optimal';
      default:
        return '';
    }
  }
}
