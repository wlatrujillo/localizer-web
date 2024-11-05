import { Routes } from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'auth/login',
      pathMatch: 'full'
    },
    {
      path: 'auth',
      component: AuthLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
        }
      ]
    },
    {
      path: 'admin',
      component: AdminLayoutComponent
    }
];
