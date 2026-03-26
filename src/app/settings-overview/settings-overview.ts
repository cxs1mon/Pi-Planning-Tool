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
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-settings-overview',
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgxSkeletonLoaderComponent,
  ],
  templateUrl: './settings-overview.html',
  styleUrl: './settings-overview.scss',
})
export class SettingsOverview {
  currentPi = input<PiResponse | null>(null);
  loading = input<boolean>(true);

  sendNewPi = output<PiResponse>();
  sendOpenDialog = output<{
    mode: 'delete';
    type: 'pi';
    pi?: PiResponse;
  }>();

  piForm = new FormGroup(
    {
      name: new FormControl<string>('', {
        validators: [Validators.required, Validators.maxLength(30)],
        nonNullable: true,
      }),
      startDate: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      endDate: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    { validators: this.dateValidator },
  );

  constructor() {
    toObservable(this.currentPi).subscribe((pi) => {
      if (!pi) return;

      this.piForm.patchValue({
        name: pi.name ?? '',
        startDate: pi.startDate ?? '',
        endDate: pi.endDate ?? '',
      });
    });
  }

  updateForm(): void {
    this.piForm.markAllAsTouched();

    if (this.piForm.invalid) {
      return;
    }

    const newPi: PiResponse = {
      name: this.piForm.controls.name.value,
      startDate: this.piForm.controls.startDate.value,
      endDate: this.piForm.controls.endDate.value,
    };

    this.sendNewPi.emit(newPi);
  }

  openDeleteDialog(): void {
    const pi = this.currentPi();

    if (!pi) {
      return;
    }

    this.sendOpenDialog.emit({
      mode: 'delete',
      type: 'pi',
      pi,
    });
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) return null;

    if (new Date(end) <= new Date(start)) {
      return { dateRangeInvalid: true };
    }

    return null;
  }
}
