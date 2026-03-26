import { Component, input, output, signal } from '@angular/core';
import { EmployeeResponse } from '../../../Model/employee-model';
import { NgOptimizedImage } from '@angular/common';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-employee-overview',
  imports: [NgOptimizedImage, NgxSkeletonLoaderComponent],
  templateUrl: './employee-overview.html',
  styleUrl: './employee-overview.scss',
})
export class EmployeeOverview {
  employeeList = input<EmployeeResponse[]>([]);
  sendOpenDialog = output<{
    mode: 'create' | 'edit' | 'delete';
    type: 'employee';
    employee?: EmployeeResponse;
  }>();

  $showAll = signal(false);
  loading = input<boolean>(true);

  openCreateDialog() {
    this.sendOpenDialog.emit({
      mode: 'create',
      type: 'employee',
    });
  }

  openDeleteDialog(employee: EmployeeResponse) {
    this.sendOpenDialog.emit({
      mode: 'delete',
      type: 'employee',
      employee,
    });
  }

  openEditDialog(employee: EmployeeResponse) {
    this.sendOpenDialog.emit({
      mode: 'edit',
      type: 'employee',
      employee,
    });
  }
}
