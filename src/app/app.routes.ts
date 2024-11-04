import { Routes } from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'auth',
      pathMatch: 'full'
    },
    {
      path: 'auth',
      component: AuthLayoutComponent,
      children: [
        {
          path: 'login',
          loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
        }
      ]
    },
    {
      path: 'admin',
      component: AdminLayoutComponent
    }
];
