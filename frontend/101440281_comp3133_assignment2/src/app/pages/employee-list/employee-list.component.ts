import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      firstName
      lastName
      email
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  employees: any[] = [];

  constructor(private apollo: Apollo, private router: Router) {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only' // always get latest
    }).valueChanges.subscribe({
      next: ({ data }) => {
        this.employees = data.employees;
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id }
      }).subscribe({
        next: () => {
          alert('🗑️ Employee deleted!');
          this.fetchEmployees(); // refresh the list
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('❌ Failed to delete employee');
        }
      });
    }
  }

  viewEmployee(id: string) {
    this.router.navigate(['/view-employee', id]);
  }

  updateEmployee(id: string) {
    this.router.navigate(['/update-employee', id]);
  }
}
