import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $department: String!
    $position: String!
    $profilePic: Upload
  ) {
    addEmployee(
      firstName: $firstName
      lastName: $lastName
      email: $email
      department: $department
      position: $position
      profilePic: $profilePic
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.selectedFile = file || null;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const { firstName, lastName, email, department, position } = this.employeeForm.value;

      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
          firstName,
          lastName,
          email,
          department,
          position,
          profilePic: this.selectedFile
        }
      }).subscribe({
        next: () => {
          alert('✅ Employee added successfully!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Add employee error:', err);
          alert('❌ Failed to add employee');
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
