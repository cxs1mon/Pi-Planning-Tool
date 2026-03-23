import { Component, input } from '@angular/core';
import { EmployeeResponse } from '../../../Model/employee-model';

@Component({
  selector: 'app-employee-overview',
  imports: [],
  templateUrl: './employee-overview.html',
  styleUrl: './employee-overview.scss',
})
export class EmployeeOverview {
  employeesList = input<EmployeeResponse[]>([]);
}
