import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  test: Date = new Date();
  loading: boolean = false;
  submitted: boolean = false;
  loginForm: FormGroup;

  constructor(private element: ElementRef,
              private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
    });

  }

  // for accessing to form fields
  get fval() { return this.loginForm.controls; }

  ngOnInit() {
    var navbar : HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
  }

  ngAfterViewInit() {
    const card = document.getElementsByClassName('card card-login')[0];
    console.log('Card >>', card);
    setTimeout(function() {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 200);

  }

  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName('body')[0];
    var sidebar = document.getElementsByClassName('navbar-collapse')[0];
    if (this.sidebarVisible == false) {
      setTimeout(function() {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }

  ngOnDestroy(){
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }

  onLoginSubmit(){
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.authService.login(this.fval['email']['value'], this.fval['password']['value'])
    .subscribe(() => { this.router.navigate(['/admin/projects']); this.loading = false;}, error => {console.error(error); this.loading = false;});
  }
}
