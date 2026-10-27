import { Component, signal, inject, effect, ChangeDetectionStrategy } from '@angular/core';
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
} from '@musashi-eng/design-system';

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
  styleUrl: './app.less',
})
export class App {
  private readonly toast = inject(ToastService);

  // タイトル
  readonly title = signal('TANE');

  // ===== メインカラー切替 =====
  /**
   * 現在のメインカラー。
   * :root（documentElement）の --color-primary を上書きする。
   * hover/soft は styles.css の :root で color-mix(var(--color-primary) ...) として
   * 定義されているため、:root の primary を書き換えると同じ :root スコープで再計算され、
   * hover/soft も追従する（app-root 要素への上書きだと :root の式に届かず追従しない）。
   */
  readonly primary = signal('#0095bc');

  constructor() {
    // primary が変わるたび :root の CSS 変数を更新 → color-mix 式が hover/soft を再計算
    effect(() => {
      document.documentElement.style.setProperty('--color-primary', this.primary());
    });
  }

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

  // ===== デザイントークン展示（配列駆動）=====
  // 値はベタ書きせず CSS 変数（--color-xxx 等）を参照して描画する。
  // トークンが増減したら、下の配列に 1 行足す/消すだけで展示が追従する。

  /** カラートークン（var 参照で実色を表示） */
  readonly colorTokens: ReadonlyArray<{ varName: string; label: string; usage: string }> = [
    { varName: '--color-primary', label: 'primary', usage: 'ブランド・CTA（基準色）' },
    { varName: '--color-primary-hover', label: 'primary-hover', usage: 'ホバー状態' },
    { varName: '--color-primary-soft', label: 'primary-soft', usage: '選択行・ハイライト背景' },
    { varName: '--color-success', label: 'success', usage: '成功・完了' },
    { varName: '--color-warning', label: 'warning', usage: '注意' },
    { varName: '--color-danger', label: 'danger', usage: '危険・エラー' },
    { varName: '--color-bg', label: 'bg', usage: 'ページ下地' },
    { varName: '--color-surface', label: 'surface', usage: 'カード・パネル面' },
    { varName: '--color-border', label: 'border', usage: '境界線' },
    { varName: '--color-text-main', label: 'text-main', usage: '本文' },
    { varName: '--color-text-sub', label: 'text-sub', usage: '補助テキスト' },
  ];

  /** タイポグラフィ（サイズ見本） */
  readonly typographyTokens: ReadonlyArray<{ className: string; label: string; sample: string }> = [
    { className: 'text-3xl font-bold', label: '3xl / bold', sample: '見出し 1' },
    { className: 'text-2xl font-semibold', label: '2xl / semibold', sample: '見出し 2' },
    { className: 'text-xl font-semibold', label: 'xl / semibold', sample: '見出し 3' },
    { className: 'text-base', label: 'base', sample: '本文テキスト（標準）' },
    { className: 'text-sm', label: 'sm', sample: '補助テキスト（小）' },
    { className: 'text-xs font-mono', label: 'xs / mono', sample: '--token: value' },
  ];

  /** ボーダー Radius */
  readonly radiusTokens: ReadonlyArray<{ varName: string; label: string; usage: string }> = [
    { varName: '--radius-default', label: 'default (6px)', usage: 'ボタン・入力フィールド' },
    { varName: '--radius-md', label: 'md (8px)', usage: 'カード' },
    { varName: '--radius-lg', label: 'lg (12px)', usage: 'モーダル' },
  ];

  /** シャドウ */
  readonly shadowTokens: ReadonlyArray<{ varName: string; label: string; usage: string }> = [
    { varName: '--shadow-modern', label: 'modern', usage: 'カード・テーブル' },
    { varName: '--shadow-header-elevation', label: 'header-elevation', usage: 'ヘッダー・フッター' },
  ];

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
