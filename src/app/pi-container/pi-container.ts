import { Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../service/dataService';
import { PiOverview } from '../pi-overview/pi-overview';
import { PiResponse } from '../../../Model/pi-model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogContainer } from '../dialog-container/dialog-container';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pi-container',
  imports: [PiOverview],
  templateUrl: './pi-container.html',
  styleUrl: './pi-container.scss',
})
export class PiContainer implements OnInit {
  piList: PiResponse[] = [];
  router = inject(Router);
  private dataService = inject(DataService);
  private snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  $loading = signal(true);

  createNewPi(piData: PiResponse): void {
    this.dataService.createPi(piData).subscribe({
      next: (createdPi: PiResponse) => {
        this.setPi(createdPi!);
        this.navigate(createdPi.id!);
        this.snackBar.open('PI erfolgreich erstellt', 'OK', {
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

  selectPi(selectedPiId: number): void {
    this.dataService.getOnePi(selectedPiId).subscribe({
      next: (pi: PiResponse) => {
        this.setPi(pi);
        this.navigate(selectedPiId);
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
  }

  navigate(selectedPiId: number): void {
    this.router.navigate(['/overview', selectedPiId]);
  }

  ngOnInit() {
    this.getAllPis();
  }

  getAllPis(): void {
    this.dataService.getPis().subscribe({
      next: (piList: PiResponse[]) => {
        this.piList = piList;
        this.$loading.set(false);
      },
      error: (err) => {
        console.error('Fehler beim abfragen:', err);
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
  }

  setPi(pi: PiResponse): void {
    this.dataService.setPi(pi);
  }
}
