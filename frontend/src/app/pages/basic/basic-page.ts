import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PanelComponent,
  ButtonComponent,
  BadgeComponent,
  AlertComponent,
  LoadingComponent,
  UnreadDotComponent,
  CardComponent,
  CollapseComponent,
  CheckboxComponent,
  TooltipDirective,
  ToastService,
} from '@musashi-eng/design-system';

@Component({
  selector: 'app-basic-page',
  imports: [
    FormsModule,
    PanelComponent,
    ButtonComponent,
    BadgeComponent,
    AlertComponent,
    LoadingComponent,
    UnreadDotComponent,
    CardComponent,
    CollapseComponent,
    CheckboxComponent,
    TooltipDirective,
  ],
  templateUrl: './basic-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPage {
  private readonly toast = inject(ToastService);

  /** 折りたたみデモ: 開閉状態（双方向バインド） */
  readonly collapseOpen = signal(true);

  /** 中間状態デモ: 子の選択状態 */
  readonly childChecks = signal([true, false, false]);
  /** 子がすべて選択か */
  readonly allChecked = computed(() => this.childChecks().every(Boolean));
  /** 一部だけ選択か（親チェックを中間状態にする） */
  readonly someChecked = computed(() => this.childChecks().some(Boolean) && !this.allChecked());

  /** 重ね表示ローディングのデモ状態 */
  readonly overlayActive = signal(false);

  /** 親チェックの切替: 全選択 / 全解除 */
  toggleAll(checked: boolean): void {
    this.childChecks.set([checked, checked, checked]);
  }

  /** 子チェックの切替 */
  toggleChild(index: number, checked: boolean): void {
    this.childChecks.update((list) => list.map((v, i) => (i === index ? checked : v)));
  }

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
