import { Component, OnInit, ElementRef } from '@angular/core';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [ RouterModule ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent implements OnInit{

  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;
  private mobile_menu_visible: any = 0;

  constructor(private router: Router, private element: ElementRef) {
    this.sidebarVisible = false;
    this._router = new Subscription();
  }

  ngOnInit(): void {


    const navbar: HTMLElement = this.element.nativeElement;

    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.sidebarClose();
      const $layer = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
    });

  }


  sidebarOpen() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function(){
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    setTimeout(function() {
      $toggle.classList.add('toggled');
    }, 430);

    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');


    if (body.querySelectorAll('.wrapper-full-page')) {
      document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    }else if (body.classList.contains('off-canvas-sidebar')) {
      document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    }

    setTimeout(function() {
      $layer.classList.add('visible');
    }, 100);

    $layer.onclick = () => { //asign a function
      body.classList.remove('nav-open');
      this.mobile_menu_visible = 0;
      this.sidebarVisible = false;

      $layer.classList.remove('visible');
      setTimeout(function() {
        $layer.remove();
        $toggle.classList.remove('toggled');
      }, 400);
    };

    body.classList.add('nav-open');
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  };

  sidebarClose() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');

    this.sidebarVisible = false;
    body.classList.remove('nav-open');
    // $('html').removeClass('nav-open');
    body.classList.remove('nav-open');
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function() {
      $toggle?.classList.remove('toggled');
    }, 400);

    this.mobile_menu_visible = 0;
  };

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

}
