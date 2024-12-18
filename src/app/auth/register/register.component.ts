import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, AbstractControl, FormBuilder, FormGroup, PatternValidator, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/service/auth.service';
import { User } from '../../core/model/user';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatCheckboxModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {

  test: Date = new Date();
  loading = false;
  submitted = false;
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {

    this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.compose([
                  Validators.required,
                  // 2. check whether the entered password has a number
                  RegisterComponent.patternValidator(/\d/, { hasNumber: true }),
                  // 3. check whether the entered password has upper case letter
                  RegisterComponent.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
                  // 4. check whether the entered password has a lower-case letter
                  RegisterComponent.patternValidator(/[a-z]/, { hasSmallCase: true }),
                  Validators.minLength(8)
                ])],
                confirmPassword: [null, Validators.required]
          },
          {
            // check whether our password and confirm password match
            validator: RegisterComponent.passwordMatchValidator
          });
  }


  get fval() { return this.registerForm.controls; }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
    body.classList.add('off-canvas-sidebar');
  }

  ngAfterViewInit() {
    const card = document.getElementsByClassName('card card-signup')[0];
    console.log('Card >>', card);
    setTimeout(function() {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 200);

  }
  ngOnDestroy(){
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
    body.classList.remove('off-canvas-sidebar');
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword')?.value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword')?.setErrors({ NoPasswordMatch: true });
    }
  }

  /* Get errors */
  handleError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      console.log('Invalid form');
      return;
    }

    const {firstName, lastName, email, password} = this.registerForm.value;
    this.loading = true;
    this.authService
    .register({firstName, lastName, email, password} as User)
    .subscribe( () => {
      this.loading = false;
       console.log('User is registered');
       this.router.navigate(['/auth/login']);
    },
    (error) => {
      this.loading = false;
      console.error('Error >>', error);
    });
  }

}
