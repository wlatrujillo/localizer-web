import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { AccountComponent } from './account/account.component';

export const ADMIN_ROUTES: Routes = [
    {
      path: '',
      loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
    },
    {
      path: 'account',
      loadComponent: () => import('./account/account.component').then(m => m.AccountComponent),
    }
];
