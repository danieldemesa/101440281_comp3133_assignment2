import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { RouterModule } from '@angular/router'; // ✅ ADD THIS

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
  imports: [CommonModule, RouterModule], // ✅ ADD RouterModule HERE
  template: `
    <div class="container" *ngIf="employee">
      <h2>View Employee</h2>

      <div class="employee-details">
        <div class="info">
          <p><strong>First Name:</strong> {{ employee.firstName }}</p>
          <p><strong>Last Name:</strong> {{ employee.lastName }}</p>
          <p><strong>Email:</strong> {{ employee.email }}</p>
          <p><strong>Department:</strong> {{ employee.department }}</p>
          <p><strong>Position:</strong> {{ employee.position }}</p>
        </div>

        <div class="photo" *ngIf="employee.profilePic">
          <img [src]="'http://localhost:5000/uploads/' + employee.profilePic" alt="Profile Picture" />
        </div>
      </div>

      <button class="btn-back" routerLink="/employees">← Back</button>
    </div>
  `,
  styles: [`
    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
    }
    .employee-details {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .info {
      flex: 1;
    }
    .photo img {
      max-width: 200px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .btn-back {
      margin-top: 20px;
      background: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ViewEmployeeComponent implements OnInit {
  employee: any;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).valueChanges.subscribe(({ data }) => {
      this.employee = data.getEmployee;
    });
  }
}
