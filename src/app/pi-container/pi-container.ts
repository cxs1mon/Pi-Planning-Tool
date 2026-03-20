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
  private dataService = inject(DataService);

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
  navigate(): void {
    console.log('navigate');
  }
}
