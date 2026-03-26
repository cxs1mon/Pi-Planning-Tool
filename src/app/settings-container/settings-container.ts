import { Component, inject, OnInit, signal } from '@angular/core';
import { SettingsOverview } from '../settings-overview/settings-overview';
import { PiResponse } from '../../../Model/pi-model';
import { DataService } from '../service/dataService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogContainer } from '../dialog-container/dialog-container';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings-container',
  imports: [SettingsOverview],
  templateUrl: './settings-container.html',
  styleUrl: './settings-container.scss',
})
export class SettingsContainer implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  public piId = 0;

  $currentPi = signal<PiResponse | null>(null);
  $loading = signal(true);

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
          this.$loading.set(false);
          this.$currentPi.set(pi);
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
          this.$loading.set(false);
        },
      });
    });
  }

  openDialog(event: { mode: 'delete'; type: 'pi'; pi?: PiResponse }) {
    this.dialog
      .open(DialogContainer, {
        data: event,
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.deleteOnePi();
      });
  }

  updateOnePi(newPi: PiResponse): void {
    const updatedPi: PiResponse = {
      ...newPi,
      id: this.piId,
    };

    this.dataService.updatePi(updatedPi).subscribe({
      next: (res: PiResponse) => {
        this.$currentPi.set(res);
        this.snackBar.open('PI erfolgreich gelöscht', 'OK', {
          duration: 3000,
        });
        this.navigate(1);
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

  deleteOnePi(): void {
    this.dataService.deletePi(this.piId).subscribe({
      next: () => {
        this.snackBar.open('Mitarbeiter erfolgreich erstellt', 'OK', {
          duration: 3000,
        });
        this.navigate(0);
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

  navigate(location: number) {
    if (location === 1) {
      this.router.navigate(['/overview', this.piId]);
    } else if (location === 0) {
      this.router.navigate(['/']);
    }
  }
}
