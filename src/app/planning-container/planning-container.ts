import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { PlanningOverview } from '../planning-overview/planning-overview';
import { FeatureResponse } from '../../../Model/feature-model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/dataService';
import { EmployeeResponse } from '../../../Model/employee-model';
import { PlanningData } from '../../../Model/planning-data-model';
import { DialogContainer } from '../dialog-container/dialog-container';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-planning-container',
  imports: [PlanningOverview],
  templateUrl: './planning-container.html',
  styleUrl: './planning-container.scss',
})
export class PlanningContainer implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  dialog = inject(MatDialog);

  public $allFeatures: WritableSignal<FeatureResponse[]> = signal<FeatureResponse[]>([]);
  public $allEmployees: WritableSignal<EmployeeResponse[]> = signal<EmployeeResponse[]>([]);
  $featureLoading: WritableSignal<boolean> = signal<boolean>(true);
  $employeeLoading: WritableSignal<boolean> = signal<boolean>(true);
  public $feData: Signal<PlanningData> = computed<PlanningData>(() => {
    const effort: number = this.$allFeatures().reduce(
      (sum: number, f: FeatureResponse): number => sum + (f.feEffort ?? 0),
      0,
    );

    const capacity: number = this.$allEmployees().reduce(
      (sum: number, e: EmployeeResponse): number => sum + (e.feCapacity ?? 0),
      0,
    );

    const remaining: number = capacity - effort;

    let status = 'optimal ausgelastet';

    if (remaining > 0) {
      status = 'unterplant';
    } else if (remaining < 0) {
      status = 'überplant';
    }

    return {
      effort,
      capacity,
      remaining,
      status,
    };
  });

  public $beData = computed(() => {
    const effort: number = this.$allFeatures().reduce(
      (sum: number, f: FeatureResponse): number => sum + (f.beEffort ?? 0),
      0,
    );

    const capacity: number = this.$allEmployees().reduce(
      (sum: number, e: EmployeeResponse): number => sum + (e.beCapacity ?? 0),
      0,
    );

    const remaining: number = capacity - effort;

    let status = 'optimal ausgelastet';

    if (remaining > 0) {
      status = 'unterplant';
    } else if (remaining < 0) {
      status = 'überplant';
    }

    return {
      effort,
      capacity,
      remaining,
      status,
    };
  });

  private piId = 0;

  ngOnInit(): void {
    this.getPathId();
  }

  getPathId(): void {
    this.activeRoute.paramMap.subscribe((pm) => {
      const rawId = pm.get('id');

      // check ob es vorhanden ist
      if (rawId === null) {
        console.error('Id nicht gefunden');
        return;
      }

      const id = Number(rawId);

      // check ob es eine zahl ist
      if (!Number.isFinite(id)) {
        return;
      }
      this.piId = id;

      this.dataService.getOnePi(this.piId).subscribe({
        next: (pi) => {
          this.dataService.setPi(pi);
        },
        error: (err) => {
          console.error('Fehler beim Laden des PI:', err);
        },
      });

      this.getFeatures();
      this.getEmployees();
    });
  }

  getFeatures(): void {
    this.dataService.getFeatures(this.piId).subscribe({
      next: (res: FeatureResponse[]) => {
        this.$allFeatures.set(res);
        this.$featureLoading.set(false);
      },
      error: (err): void => {
        console.error('Fehler beim Abfragen:', err);
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
        this.$featureLoading.set(false);
      },
    });
  }

  getEmployees(): void {
    this.dataService.getEmployees(this.piId).subscribe({
      next: (res: EmployeeResponse[]): void => {
        this.$allEmployees.set(res);
        this.$employeeLoading.set(false);
      },
      error: (err): void => {
        console.error('Fehler beim Abfragen:', err);
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
        this.$employeeLoading.set(false);
      },
    });
  }
}
