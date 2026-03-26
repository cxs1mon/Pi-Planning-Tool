import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { EmployeeOverview } from '../employee-overview/employee-overview';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/dataService';
import { EmployeeResponse } from '../../../Model/employee-model';
import { MatDialog } from '@angular/material/dialog';
import { DialogContainer } from '../dialog-container/dialog-container';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);

  public $allEmployees: WritableSignal<EmployeeResponse[]> = signal<EmployeeResponse[]>([]);

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
          this.dialog.open(DialogContainer, {
            data: {
              type: 'error',
              mode: 'backend-unavailable',
            },
            disableClose: true,
          });
        },
      });

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
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
      },
    });
  }

  openDialog(event: {
    mode: 'create' | 'edit' | 'delete';
    type: 'employee';
    employee?: EmployeeResponse;
  }) {
    this.dialog
      .open(DialogContainer, {
        data: event,
      })
      .afterClosed()
      .subscribe((result) => {
        // result, was beim schliessen vom Dialog zurückkommt
        if (!result) {
          return;
        }

        switch (event.mode) {
          case 'create':
            this.addEmployee(result);
            break;

          case 'edit':
            this.updateEmployee(event.employee!, result);
            break;

          case 'delete':
            this.deleteEmployee(event.employee!);
            break;
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
        this.snackBar.open('Mitarbeiter erfolgreich erstellt', 'OK', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Fehler beim Erstellen:', err);
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
      },
    });
  }

  updateEmployee(oldEmployee: EmployeeResponse, newEmployee: EmployeeResponse) {
    this.dataService.updateEmployee(this.piId, oldEmployee.id!, newEmployee).subscribe({
      next: () => {
        this.getEmployees();
        this.snackBar.open('Mitarbeiter erfolgreich aktualisiert', 'OK', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren:', err);
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
      },
    });
  }

  deleteEmployee(toDeleteEmployee: EmployeeResponse) {
    const deleteEmployeeId = toDeleteEmployee.id;
    this.dataService.deleteEmployee(this.piId, deleteEmployeeId!).subscribe({
      next: () => {
        this.getEmployees();
        this.snackBar.open('Mitarbeiter erfolgreich gelöscht', 'OK', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Fehler beim Löschen:', err);
        this.dialog.open(DialogContainer, {
          data: {
            type: 'error',
            mode: 'backend-unavailable',
          },
          disableClose: true,
        });
      },
    });
  }
}
