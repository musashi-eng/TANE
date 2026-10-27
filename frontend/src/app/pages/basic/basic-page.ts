import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  PanelComponent,
  ButtonComponent,
  BadgeComponent,
  AlertComponent,
  LoadingComponent,
  UnreadDotComponent,
  ToastService,
} from '@musashi-eng/design-system';

@Component({
  selector: 'app-basic-page',
  imports: [
    PanelComponent,
    ButtonComponent,
    BadgeComponent,
    AlertComponent,
    LoadingComponent,
    UnreadDotComponent,
  ],
  templateUrl: './basic-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPage {
  private readonly toast = inject(ToastService);

  /** トーストデモ: variant ごとに通知を出す */
  showToast(variant: 'success' | 'warning' | 'error' | 'info'): void {
    const messages: Record<typeof variant, string> = {
      success: '保存しました',
      warning: '確認してください',
      error: 'エラーが発生しました',
      info: 'お知らせがあります',
    };
    this.toast[variant](messages[variant]);
  }
}
