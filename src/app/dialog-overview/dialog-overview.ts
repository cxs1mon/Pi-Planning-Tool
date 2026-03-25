import { Component, effect, input, output } from '@angular/core';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EmployeeResponse } from '../../../Model/employee-model';
import { NgOptimizedImage } from '@angular/common';
import { FeatureResponse } from '../../../Model/feature-model';

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
  mode = input<'create' | 'edit' | 'delete'>('create');
  type = input<'employee' | 'feature' | 'pi'>('employee');
  employee = input<EmployeeResponse>();
  sendSaveClick = output<EmployeeResponse | FeatureResponse>();
  sendDeleteClick = output<void>();
  sendCancelClick = output<void>();

  effortFormError: string | null = null;

  featureEffortValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const feControl = form.get('effortFe');
      const beControl = form.get('effortBe');

      const feValue = feControl?.value ?? 0;
      const beValue = beControl?.value ?? 0;

      if (!feControl || !beControl) {
        return null;
      }

      if (feValue <= 0 && beValue <= 0) {
        return { noEffort: true };
      }
      return null;
    };
  }

  employeeForm = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    role: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    capacityFe: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(0)],
    }),
    capacityBe: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  featureForm = new FormGroup(
    {
      featureNumber: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      title: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      description: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      effortFe: new FormControl<number>(0, {
        validators: [Validators.required, Validators.min(0)],
      }),
      effortBe: new FormControl<number>(0, {
        validators: [Validators.required, Validators.min(0)],
      }),
    },
    {
      validators: [this.featureEffortValidator()],
    },
  );

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
    if (this.type() === 'employee') {
      this.saveEmployee();
      return;
    } else {
      this.saveFeature();
    }
  }

  private saveEmployee(): void {
    this.employeeForm.markAllAsTouched();

    if (this.employeeForm.valid) {
      const newEmployee: EmployeeResponse = {
        name: this.employeeForm.controls.name.value?.trim() ?? '', // ?? ersetzt das linke mit dem rechte wenn es null oder undefined ist
        role: this.employeeForm.controls.role.value?.trim() ?? '',
        feCapacity: this.employeeForm.controls.capacityFe.value ?? 0,
        beCapacity: this.employeeForm.controls.capacityBe.value ?? 0,
      };
      this.sendSaveClick.emit(newEmployee);
    } else {
      console.warn('Fehlerhafte eingabe');
    }
  }

  private saveFeature(): void {
    this.featureForm.markAllAsTouched();

    if (this.featureForm.valid) {
      const newFeature: FeatureResponse = {
        featureNumber: this.featureForm.controls.featureNumber.value?.trim() ?? '',
        title: this.featureForm.controls.title.value?.trim() ?? '',
        description: this.featureForm.controls.description.value?.trim() ?? '',
        feEffort: this.featureForm.controls.effortFe.value ?? 0,
        beEffort: this.featureForm.controls.effortBe.value ?? 0,
      };

      this.sendSaveClick.emit(newFeature);
    } else {
      console.warn('Fehlerhafte Eingabe');
    }
  }

  onDeleteClick(): void {
    this.sendDeleteClick.emit();
  }

  onCancelClick(): void {
    this.sendCancelClick.emit();
  }
}
