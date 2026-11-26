import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  PanelComponent,
  ButtonComponent,
  BreadcrumbComponent,
  type BreadcrumbItem,
  TabGroupComponent,
  TabComponent,
  ModalComponent,
  DialogService,
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

  private readonly dialog = inject(DialogService);

  /** ダイアログの結果表示 */
  readonly dialogResult = signal('（まだ操作していません）');

  /** 確認ダイアログ（通常） */
  async openConfirm(): Promise<void> {
    const ok = await this.dialog.confirm({
      title: '保存の確認',
      message: '変更内容を保存しますか？',
      okLabel: '保存する',
      cancelLabel: 'やめる',
    });
    this.dialogResult.set(ok ? '「保存する」を選びました' : 'キャンセルしました');
  }

  /** 確認ダイアログ（削除など取り返しのつかない操作） */
  async openDangerConfirm(): Promise<void> {
    const ok = await this.dialog.confirm({
      title: '削除の確認',
      message: 'この操作は取り消せません。本当に削除しますか？',
      okLabel: '削除する',
      danger: true,
    });
    this.dialogResult.set(ok ? '削除を実行しました（デモ）' : '削除をキャンセルしました');
  }

  /** エラーダイアログ */
  async openError(): Promise<void> {
    await this.dialog.error({ title: 'エラー', message: '保存に失敗しました。時間をおいて再度お試しください。' });
    this.dialogResult.set('エラーダイアログを閉じました');
  }
}
