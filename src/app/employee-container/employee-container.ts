import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { EmployeeOverview } from '../employee-overview/employee-overview';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/dataService';
import { EmployeeResponse } from '../../../Model/employee-model';
import { MatDialog } from '@angular/material/dialog';
import { DialogContainer } from '../dialog-container/dialog-container';

@Component({
  selector: 'app-employee-container',
  imports: [EmployeeOverview],
  templateUrl: './employee-container.html',
  styleUrl: './employee-container.scss',
})
export class EmployeeContainer implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private piId = 0;
  dialog = inject(MatDialog);

  public $allEmployees: WritableSignal<EmployeeResponse[]> = signal<EmployeeResponse[]>([]);

  ngOnInit(): void {
    this.getPathId();
  }

  getPathId() {
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
      this.getEmployees();
    });
  }

  getEmployees() {
    this.dataService.getEmployees(this.piId).subscribe({
      next: (res: EmployeeResponse[]) => {
        this.$allEmployees.set(res);
      },
      error: (err) => {
        console.error('Fehler beim Abfragen:', err);
      },
    });
  }

  openCreateDialog() {
    this.dialog
      .open(DialogContainer, {
        data: { mode: 'create', type: 'employee' },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.addEmployee(result);
        }
      });
  }

  addEmployee(newEmployee: EmployeeResponse) {
    const employeeWithId: EmployeeResponse = {
      ...newEmployee,
      id: this.piId,
    };
    this.dataService.createEmployee(employeeWithId).subscribe({
      next: () => {
        this.getEmployees();
      },
      error: (err) => {
        console.error('Fehler beim Erstellen:', err);
      },
    });
  }
}
