import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      id
      email
      token
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;

      console.log('📤 Submitting signup:', { email, password }); // for debug

      this.apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { email, password }
      }).subscribe({
        next: (res: any) => {
          console.log('✅ Signup successful:', res); // for debug
          const token = res.data.signup.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('❌ Signup error:', err);
          alert('Signup failed. Check console for details.');
        }
      });
    } else {
      console.warn('❗ Form is invalid:', this.signupForm.value);
    }
  }
}
