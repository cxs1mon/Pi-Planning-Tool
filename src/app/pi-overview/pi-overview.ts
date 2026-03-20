import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { PiResponse } from '../../../Model/pi-model';

@Component({
  selector: 'app-pi-overview',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './pi-overview.html',
  styleUrl: './pi-overview.scss',
})
export class PiOverview {
  @Output() sendFormClick = new EventEmitter<PiResponse>();

  piForm = new FormGroup(
    {
      name: new FormControl<string>('', { validators: [Validators.required] }),
      startDate: new FormControl<string>('', { validators: [Validators.required] }),
      endDate: new FormControl<string>('', { validators: [Validators.required] }),
    },
    { validators: this.dateValidator },
  );

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) return null; // andere Validatoren übernehmen required

    if (new Date(end) <= new Date(start)) {
      return { dateRangeInvalid: true };
    }

    return null;
  }

  formCheck(): void {
    this.piForm.markAllAsTouched();

    if (this.piForm.invalid) {
      console.warn('Bitte alle Felder ausfüllen');
      return;
    } else {
      this.sendForm();
    }
  }

  sendForm(): void {
    if (this.piForm.valid) {
      const newPi: PiResponse = {
        name: this.piForm.controls.name.value ?? '', // ?? ersetzt das linke mit dem rechte wenn es null oder undefined ist
        startDate: this.piForm.controls.startDate.value ?? '',
        endDate: this.piForm.controls.endDate.value ?? '',
      };

      this.sendFormClick.emit(newPi);
    }
  }
}
