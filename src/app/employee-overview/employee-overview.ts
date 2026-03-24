import { Component, input, output, signal } from '@angular/core';
import { EmployeeResponse } from '../../../Model/employee-model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-employee-overview',
  imports: [NgOptimizedImage],
  templateUrl: './employee-overview.html',
  styleUrl: './employee-overview.scss',
})
export class EmployeeOverview {
  employeeList = input<EmployeeResponse[]>([]);
  sendOpenCreateDialog = output();

  $showAll = signal(false);

  openDialog() {
    this.sendOpenCreateDialog.emit();
  }
}
