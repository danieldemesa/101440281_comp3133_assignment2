import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Needed for routerLink in the HTML
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

const GET_EMPLOYEES = gql`
  query {
    getEmployees {
      _id
      firstName
      lastName
      email
    }
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ routerLink needs RouterModule
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
      query: GET_EMPLOYEES
    }).valueChanges.subscribe({
      next: ({ data }) => {
        this.employees = data.getEmployees;
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }
}
