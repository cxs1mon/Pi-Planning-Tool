import { Component, input, output } from '@angular/core';
import { PiResponse } from '../../../Model/pi-model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings-overview',
  imports: [FormsModule, MatError, MatFormField, MatInput, MatLabel, ReactiveFormsModule],
  templateUrl: './settings-overview.html',
  styleUrl: './settings-overview.scss',
})
export class SettingsOverview {
  currentPi = input<PiResponse>();
  sendNewPi = output<PiResponse>();
  sendDeletion = output<void>();

  clickedUpdate = false;
  clickedDelete = false;

  piForm = new FormGroup(
    {
      name: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      startDate: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      endDate: new FormControl<string>('', {
        validators: [Validators.required],
      }),
    },
    { validators: this.dateValidator },
  );

  constructor() {
    toObservable(this.currentPi).subscribe((pi) => {
      if (!pi) return;
      this.piForm.patchValue({
        name: pi.name,
        startDate: pi.startDate,
        endDate: pi.endDate,
      });
      this.piForm.markAllAsTouched();
    });
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) return null; // andere Validatoren übernehmen required

    if (new Date(end) <= new Date(start)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  deletePi() {
    this.clickedDelete = true;

    this.sendDeletion.emit();
  }

  updateForm(): void {
    this.piForm.markAllAsTouched();
    if (this.piForm.valid) {
      const newPi: PiResponse = {
        name: this.piForm.controls.name.value ?? '', // ?? ersetzt das linke mit dem rechte wenn es null oder undefined ist
        startDate: this.piForm.controls.startDate.value ?? '',
        endDate: this.piForm.controls.endDate.value ?? '',
      };

      this.clickedUpdate = true;
      this.sendNewPi.emit(newPi);
    } else {
      console.warn('Bitte alle Felder ausfüllen');
      return;
    }
  }
}
