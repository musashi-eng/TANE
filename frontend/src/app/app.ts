import { Component, signal, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AppShellComponent,
  AppHeaderComponent,
  ToastContainerComponent,
} from '@musashi-eng/design-system';
import { ThemeService } from './core/theme.service';

/** ショーケースのページナビ項目 */
interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AppShellComponent,
    AppHeaderComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.less',
})
export class App {
  private readonly theme = inject(ThemeService);

  /** アプリ名（ヘッダー表示） */
  readonly title = signal('TANE');

  /** ショーケースのページナビ */
  readonly navItems: ReadonlyArray<NavItem> = [
    { path: '/', label: '概要・トークン' },
    { path: '/basic', label: '基本' },
    { path: '/form', label: 'フォーム' },
    { path: '/data', label: 'データ表示' },
    { path: '/navigation', label: 'ナビ・オーバーレイ' },
  ];

  constructor() {
    // メインカラーが変わるたび :root の CSS 変数を更新
    // → styles.css の color-mix 式が hover/soft を再計算し全ページ追従
    effect(() => {
      document.documentElement.style.setProperty('--color-primary', this.theme.primary());
    });
  }
}
