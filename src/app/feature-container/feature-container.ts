import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/dataService';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeatureResponse } from '../../../Model/feature-model';
import { DialogContainer } from '../dialog-container/dialog-container';
import { FeatureOverview } from '../feature-overview/feature-overview';

@Component({
  selector: 'app-feature-container',
  imports: [FeatureOverview],
  templateUrl: './feature-container.html',
  styleUrl: './feature-container.scss',
})
export class FeatureContainer implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private piId = 0;
  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
    });
  }

  openDialog(event: {
    mode: 'create' | 'edit' | 'delete';
    type: 'feature';
    feature?: FeatureResponse;
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
            this.addFeature(result);
            break;
        }
      });
  }

  addFeature(newFeature: FeatureResponse) {
    const featureWithId: FeatureResponse = {
      ...newFeature,
      id: this.piId,
    };
    this.dataService.createFeature(featureWithId).subscribe({
      next: () => {
        this.snackBar.open('Feature erfolgreich erstellt', 'OK', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Fehler beim Erstellen:', err);
      },
    });
  }
}
