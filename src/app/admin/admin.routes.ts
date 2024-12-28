import { Routes } from '@angular/router';
import { ProjectResolver } from '../core/service/project.resolver';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'account',
    loadComponent: () => import('./account/account.component').then(m => m.AccountComponent),
  },
  {
    path: 'projects/:_projectId/translator',
    loadComponent: () => import('../translator/components/container/container.component').then(m => m.ContainerComponent),
    resolve: { project: ProjectResolver },
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
  },
];
