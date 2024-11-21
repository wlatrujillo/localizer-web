import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
        {
      path: 'projects',
      loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
    },
    {
      path: 'account',
      loadComponent: () => import('./account/account.component').then(m => m.AccountComponent),
    },
    {
      path: 'translator',
      loadComponent: () => import('../translator/components/container/container.component').then(m => m.ContainerComponent),
    }
];
