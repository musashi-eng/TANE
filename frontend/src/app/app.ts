import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  BadgeComponent,
  PanelComponent,
  AlertComponent,
  InputComponent,
  SelectComponent,
  type SelectOption,
  CheckboxComponent,
  SwitchComponent,
  TableComponent,
  TableColumnDirective,
  ToastContainerComponent,
  ToastService,
} from '@musashieng/design-system';

/** デモ用テーブル行の型 */
interface DemoRow {
  id: number;
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ButtonComponent,
    BadgeComponent,
    PanelComponent,
    AlertComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    SwitchComponent,
    TableComponent,
    TableColumnDirective,
    ToastContainerComponent,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--color-primary]': 'primary()',
  },
  styleUrl: './app.less',
})
export class App {
  private readonly toast = inject(ToastService);

  // タイトル
  readonly title = signal('TANE');

  // ===== メインカラー切替（showcase と同じ方式: --color-primary を上書き）=====
  /** 現在のメインカラー（host の --color-primary を上書きし、全部品が追従する） */
  readonly primary = signal('#0095bc');

  /** プリセット色（showcase と同じ6色） */
  readonly colorPresets: ReadonlyArray<{ value: string; label: string }> = [
    { value: '#0095bc', label: 'シアン（既定）' },
    { value: '#e5007e', label: 'ピンク' },
    { value: '#2563eb', label: 'ブルー' },
    { value: '#16a34a', label: 'グリーン' },
    { value: '#9333ea', label: 'パープル' },
    { value: '#ea580c', label: 'オレンジ' },
  ];

  /** #hex テキスト入力を正規化してメインカラーに反映（3桁/6桁、#省略可） */
  setHex(raw: string): void {
    let v = (raw || '').trim();
    if (v && !v.startsWith('#')) v = '#' + v;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
      this.primary.set(v.toLowerCase());
    }
  }

  // フォームデモの状態
  readonly inputValue = signal('');
  readonly selectValue = signal('');
  readonly agreeChecked = signal(false);
  readonly notifyEnabled = signal(true);

  readonly selectOptions: SelectOption[] = [
    { value: 'dev', label: '開発' },
    { value: 'design', label: 'デザイン' },
    { value: 'pm', label: 'プロジェクト管理' },
  ];

  // テーブルデモの状態
  readonly tableData = signal<DemoRow[]>([
    { id: 1, name: '鳳条 ひより', role: '管理人', status: 'active' },
    { id: 2, name: '武蔵 太郎', role: '開発', status: 'active' },
    { id: 3, name: '武蔵 花子', role: 'デザイン', status: 'inactive' },
  ]);

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
