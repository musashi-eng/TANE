import { Routes } from '@angular/router';
import { UiDemoComponent } from './ui-demo/ui-demo.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/demo',
    pathMatch: 'full'
  },
  {
    path: 'demo',
    component: UiDemoComponent
  }
];
