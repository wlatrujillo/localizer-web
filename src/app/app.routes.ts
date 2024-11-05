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
      path: '',
      component: AuthLayoutComponent,
      children: [
        {
          path: 'auth',
          loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
        }
      ]
    },
    {
      path: '',
      component: AdminLayoutComponent,
      children: [
        {
          path: 'admin',
          loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
        }

      ]
    }
];
