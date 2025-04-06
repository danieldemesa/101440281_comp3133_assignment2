import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      firstName
      lastName
      email
      department
      position
      profilePic
    }
  }
`;

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-container" *ngIf="employee; else loading">
      <h2>{{ employee.firstName }} {{ employee.lastName }}</h2>
      <img 
        *ngIf="employee.profilePic" 
        [src]="'http://localhost:5000/uploads/' + employee.profilePic" 
        alt="Profile Picture" 
        class="profile-image"
      />
      <div class="details">
        <p><strong>Email:</strong> {{ employee.email }}</p>
        <p><strong>Department:</strong> {{ employee.department }}</p>
        <p><strong>Position:</strong> {{ employee.position }}</p>
      </div>
    </div>

    <ng-template #loading>
      <p class="loading">Loading employee details...</p>
    </ng-template>
  `,
  styles: [`
    .view-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      background: #fff;
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
    }
    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-bottom: 20px;
      object-fit: cover;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .details p {
      margin: 8px 0;
      font-size: 16px;
    }
    .loading {
      text-align: center;
      font-size: 18px;
      color: #777;
      margin-top: 60px;
    }
  `]
})
export class ViewEmployeeComponent {
  employee: any;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    const id = this.route.snapshot.paramMap.get('id');
    this.fetchEmployee(id);
  }

  fetchEmployee(id: string | null) {
    if (!id) return;
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).valueChanges.subscribe({
      next: ({ data }) => {
        this.employee = data.getEmployee;
      },
      error: (err) => console.error('Error loading employee:', err)
    });
  }
}
