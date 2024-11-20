import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [ MatSidenavModule, RouterModule, FormsModule, MatIconModule ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  opened = true;

  constructor(private router: Router,
             private authService: AuthService) {

  }

  logout() {

    this.authService.logout();
    this.router.navigate(['/auth/login']);

  }

}
