import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      firstName
      lastName
      email
      department
      position
    }
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchDept: string = '';
  searchPosition: string = '';

  constructor(private apollo: Apollo, private router: Router) {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES
    }).valueChanges.subscribe({
      next: ({ data }) => {
        this.employees = data.employees;
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp =>
      emp.department.toLowerCase().includes(this.searchDept.toLowerCase()) &&
      emp.position.toLowerCase().includes(this.searchPosition.toLowerCase())
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
