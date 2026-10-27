import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tokens/tokens-page').then((m) => m.TokensPage),
    title: '概要・トークン | TANE デザインシステム',
  },
  {
    path: 'basic',
    loadComponent: () => import('./pages/basic/basic-page').then((m) => m.BasicPage),
    title: '基本 | TANE デザインシステム',
  },
  {
    path: 'form',
    loadComponent: () => import('./pages/form/form-page').then((m) => m.FormPage),
    title: 'フォーム | TANE デザインシステム',
  },
  {
    path: 'data',
    loadComponent: () => import('./pages/data/data-page').then((m) => m.DataPage),
    title: 'データ表示 | TANE デザインシステム',
  },
  {
    path: 'navigation',
    loadComponent: () => import('./pages/navigation/navigation-page').then((m) => m.NavigationPage),
    title: 'ナビ・オーバーレイ | TANE デザインシステム',
  },
  { path: '**', redirectTo: '' },
];
