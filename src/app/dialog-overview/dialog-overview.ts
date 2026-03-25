import { Component, effect, input, output } from '@angular/core';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeResponse } from '../../../Model/employee-model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dialog-overview',
  imports: [
    MatFormField,
    MatLabel,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOptimizedImage,
  ],
  templateUrl: './dialog-overview.html',
  styleUrl: './dialog-overview.scss',
})
export class DialogOverview {
  mode = input<string>('create');
  type = input<string>('employee');
  employee = input<EmployeeResponse>();
  sendCreateClick = output<EmployeeResponse | undefined>();
  sendDeleteClick = output<void>();
  sendCancelClick = output<void>();

  employeeForm = new FormGroup({
    name: new FormControl<string>(this.employee()?.name ?? '', {
      validators: [Validators.required],
    }),
    role: new FormControl<string>(this.employee()?.role ?? '', {
      validators: [Validators.required],
    }),
    capacityFe: new FormControl<number>(this.employee()?.feCapacity ?? 0, {
      validators: [Validators.required, Validators.min(0)],
    }),
    capacityBe: new FormControl<number>(this.employee()?.beCapacity ?? 0, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  constructor() {
    effect(() => {
      const employee = this.employee();

      if (employee) {
        this.employeeForm.patchValue({
          name: employee.name,
          role: employee.role,
          capacityFe: employee.feCapacity,
          capacityBe: employee.beCapacity,
        });
      }
    });
  }

  onSaveClick(): void {
    this.employeeForm.markAllAsTouched();

    if (this.employeeForm.valid) {
      const newEmployee: EmployeeResponse = {
        name: this.employeeForm.controls.name.value?.trim() ?? '', // ?? ersetzt das linke mit dem rechte wenn es null oder undefined ist
        role: this.employeeForm.controls.role.value?.trim() ?? '',
        feCapacity: this.employeeForm.controls.capacityFe.value ?? 0,
        beCapacity: this.employeeForm.controls.capacityBe.value ?? 0,
      };
      this.sendCreateClick.emit(newEmployee);
    } else {
      console.warn('Fehlerhafte eingabe');
    }
  }

  onDeleteClick(): void {
    this.sendDeleteClick.emit();
  }

  onCancelClick(): void {
    this.sendCancelClick.emit();
  }
}
