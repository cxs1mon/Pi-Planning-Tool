import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContainer } from './dialog-container/dialog-container';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private dialog = inject(MatDialog);

  handleError(error: unknown): void {
    console.error('Unerwarteter Fehler:', error);

    const errorMsg =
      error instanceof Error
        ? error.message
        : 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es später erneut.';

    this.dialog.open(DialogContainer, {
      data: {
        type: 'error',
        mode: 'unexpected-error',
        errorMsg,
      },
      disableClose: true,
    });
  }
}
