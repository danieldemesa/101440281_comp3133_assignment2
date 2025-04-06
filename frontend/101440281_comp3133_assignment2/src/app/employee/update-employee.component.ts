import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $department: String
    $position: String
    $profilePic: Upload
  ) {
    updateEmployee(
      id: $id
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
    }
  }
`;

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Update Employee</h2>

      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" novalidate>
        <div class="form-group">
          <label>First Name:</label>
          <input type="text" formControlName="firstName" />
          <div class="error" *ngIf="employeeForm.get('firstName')?.touched && employeeForm.get('firstName')?.invalid">
            First name is required.
          </div>
        </div>

        <div class="form-group">
          <label>Last Name:</label>
          <input type="text" formControlName="lastName" />
          <div class="error" *ngIf="employeeForm.get('lastName')?.touched && employeeForm.get('lastName')?.invalid">
            Last name is required.
          </div>
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input type="email" formControlName="email" />
          <div class="error" *ngIf="employeeForm.get('email')?.touched && employeeForm.get('email')?.invalid">
            <span *ngIf="employeeForm.get('email')?.errors?.['required']">Email is required.</span>
            <span *ngIf="employeeForm.get('email')?.errors?.['email']">Invalid email format.</span>
          </div>
        </div>

        <div class="form-group">
          <label>Department:</label>
          <input type="text" formControlName="department" />
          <div class="error" *ngIf="employeeForm.get('department')?.touched && employeeForm.get('department')?.invalid">
            Department is required.
          </div>
        </div>

        <div class="form-group">
          <label>Position:</label>
          <input type="text" formControlName="position" />
          <div class="error" *ngIf="employeeForm.get('position')?.touched && employeeForm.get('position')?.invalid">
            Position is required.
          </div>
        </div>

        <div class="form-group">
          <label>Profile Picture:</label>
          <input type="file" (change)="onFileChange($event)" />
          <div *ngIf="currentImage" class="preview">
            <p>Current:</p>
            <img [src]="currentImage" alt="Profile" />
          </div>
        </div>

        <div class="button-row">
          <button type="submit" class="btn-save">Update</button>
          <button type="button" class="btn-cancel" routerLink="/employees">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string = '';
  selectedFile: File | null = null;
  currentImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEmployee();
  }

  loadEmployee() {
    this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id: this.employeeId }
      })
      .valueChanges.subscribe(({ data }) => {
        const emp = data.getEmployee;
        this.employeeForm.patchValue(emp);
        if (emp.profilePic) {
          this.currentImage = `http://localhost:5000/uploads/${emp.profilePic}`;
        }
      });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.selectedFile = file || null;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const { firstName, lastName, email, department, position } = this.employeeForm.value;

      this.apollo
        .mutate({
          mutation: UPDATE_EMPLOYEE,
          variables: {
            id: this.employeeId,
            firstName,
            lastName,
            email,
            department,
            position,
            profilePic: this.selectedFile
          }
        })
        .subscribe({
          next: () => {
            alert('✅ Employee updated successfully!');
            this.router.navigate(['/employees']);
          },
          error: (err) => {
            console.error('Update error:', err);
            alert('❌ Failed to update employee');
          }
        });
    }
  }
}
