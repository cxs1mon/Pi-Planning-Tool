import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { MatOption, MatSelect } from '@angular/material/select';

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
    MatSelect,
    MatOption,
  ],
  templateUrl: './pi-overview.html',
  styleUrl: './pi-overview.scss',
})
export class PiOverview {
  @Output() sendCreateClick = new EventEmitter<PiResponse>();
  @Output() sendSelectClick = new EventEmitter<string>();
  @Input() piList: PiResponse[] = [];

  selection = new FormControl<string>('', { validators: [Validators.required] });

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

  sendForm(): void {
    this.piForm.markAllAsTouched();
    if (this.piForm.valid) {
      const newPi: PiResponse = {
        name: this.piForm.controls.name.value ?? '', // ?? ersetzt das linke mit dem rechte wenn es null oder undefined ist
        startDate: this.piForm.controls.startDate.value ?? '',
        endDate: this.piForm.controls.endDate.value ?? '',
      };
      this.sendCreateClick.emit(newPi);
    } else {
      console.warn('Bitte alle Felder ausfüllen');
      return;
    }
  }

  selectPiForm(): void {
    console.log('clicked select pi');
    this.selection.markAllAsTouched();
    if (this.selection.valid && this.selection.value) {
      console.log(this.piForm.value);
      this.sendSelectClick.emit(this.selection.value);
    } else {
      console.warn('Bitte PI auswählen');
      return;
    }
  }
}
