import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverview } from '../dialog-overview/dialog-overview';
import { EmployeeResponse } from '../../../Model/employee-model';
import { FeatureResponse } from '../../../Model/feature-model';

@Component({
  selector: 'app-dialog-container',
  imports: [DialogOverview],
  templateUrl: './dialog-container.html',
  styleUrl: './dialog-container.scss',
})
export class DialogContainer {
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DialogContainer>);

  onSave(result: EmployeeResponse | FeatureResponse | undefined): void {
    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close(true); // true, damit nicht das result = undefined ist, was abbrechen heisst
  }
}
