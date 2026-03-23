import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../service/dataService';
import { PiOverview } from '../pi-overview/pi-overview';
import { PiResponse } from '../../../Model/pi-model';
import { Router } from '@angular/router';
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

  createNewPi(piData: PiResponse): void {
    this.dataService.createPi(piData).subscribe({
      next: (createdPi: PiResponse) => {
        this.setPiId(createdPi.id!);
        setTimeout(() => {
          this.navigate();
        }, 400);
      },
      error: (err) => {
        console.error('Fehler beim Erstellen:', err);
      },
    });
  }

  selectPi(selectedPiId: number): void {
    this.setPiId(selectedPiId);
    setTimeout(() => {
      this.navigate();
    }, 400);
  }

  navigate(): void {
    this.router.navigate(['/overview']);
  }

  ngOnInit() {
    this.getAllPis();
  }

  getAllPis(): void {
    this.dataService.getPis().subscribe({
      next: (piList: PiResponse[]) => {
        this.piList = piList;
      },
      error: (err) => {
        console.error('Fehler beim abfragen:', err);
      },
    });
  }

  setPiId(piId: number): void {
    this.dataService.setPi(piId);
  }
}
