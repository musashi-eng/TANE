import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  PanelComponent,
  ButtonComponent,
  BreadcrumbComponent,
  type BreadcrumbItem,
  TabGroupComponent,
  TabComponent,
  ModalComponent,
} from '@musashi-eng/design-system';

@Component({
  selector: 'app-navigation-page',
  imports: [
    PanelComponent,
    ButtonComponent,
    BreadcrumbComponent,
    TabGroupComponent,
    TabComponent,
    ModalComponent,
  ],
  templateUrl: './navigation-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationPage {
  /** パンくず項目 */
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'ホーム', href: '/' },
    { label: 'コンポーネント', href: '/navigation' },
    { label: 'ナビ・オーバーレイ' },
  ];

  /** タブの選択状態 */
  readonly activeTab = signal(0);

  /** モーダルの開閉状態 */
  readonly modalOpen = signal(false);
}
