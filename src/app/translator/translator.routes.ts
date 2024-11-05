import { Routes } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';

export const TRANSLATOR_ROUTES: Routes = [
    {
      path: '',
      loadComponent: () => import('./components/container/container.component').then(m => m.ContainerComponent)
    }
];
