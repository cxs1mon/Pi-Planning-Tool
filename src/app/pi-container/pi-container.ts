import { Component, inject } from '@angular/core';
import { DataService } from '../service/dataService';
import { PiOverview } from '../pi-overview/pi-overview';
import { PiResponse } from '../../../Model/pi-model';
@Component({
  selector: 'app-pi-container',
  imports: [PiOverview],
  templateUrl: './pi-container.html',
  styleUrl: './pi-container.scss',
})
export class PiContainer {
  piList: PiResponse[] = [];

  private dataService = inject(DataService);

  ngOnInit(): void {
    this.getAllPis();
  }

  createNewPi(piData: PiResponse): void {
    console.log('Gesendete Daten:', piData);

    this.dataService.createPi(piData).subscribe({
      next: (createdPi: PiResponse) => {
        console.log('PI erfolgreich erstellt:', createdPi);
        this.navigate();
      },
      error: (err) => {
        console.error('Fehler beim Erstellen:', err);
        console.error('Backend Fehlertext:', err.error);
      },
    });
  }

  selectPi(piData: string): void {
    // TODO: implement select pi, so it saves it in a state in the service
  }

  navigate(): void {
    console.log('navigate');
  }

  getAllPis() {
    this.dataService.getPis().subscribe({
      next: (piList: PiResponse[]) => {
        this.piList = piList;
        console.log('Erfasste PIs:', piList);
      },
      error: (err) => {
        console.error('Fehler beim abfragen:', err);
        console.error('Backend Fehlertext:', err.error);
      },
    });
  }
}
