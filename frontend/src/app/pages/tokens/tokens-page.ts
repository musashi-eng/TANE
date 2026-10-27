import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PanelComponent, BadgeComponent } from '@musashi-eng/design-system';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-tokens-page',
  imports: [PanelComponent, BadgeComponent],
  templateUrl: './tokens-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensPage {
  private readonly theme = inject(ThemeService);

  /** 現在のメインカラー（shell の effect が :root に反映） */
  readonly primary = this.theme.primary;
  setHex(raw: string): void {
    this.theme.setHex(raw);
  }

  /** プリセット色 */
  readonly colorPresets: ReadonlyArray<{ value: string; label: string }> = [
    { value: '#0095bc', label: 'シアン（既定）' },
    { value: '#e5007e', label: 'ピンク' },
    { value: '#2563eb', label: 'ブルー' },
    { value: '#16a34a', label: 'グリーン' },
    { value: '#9333ea', label: 'パープル' },
    { value: '#ea580c', label: 'オレンジ' },
  ];

  /** カラートークン（var 参照で実色を表示） */
  readonly colorTokens: ReadonlyArray<{ varName: string; label: string; usage: string }> = [
    { varName: '--color-primary', label: 'primary', usage: 'ブランド・CTA（基準色）' },
    { varName: '--color-primary-hover', label: 'primary-hover', usage: 'ホバー状態（primary 連動）' },
    { varName: '--color-primary-soft', label: 'primary-soft', usage: '選択行・ハイライト背景（primary 連動）' },
    { varName: '--color-success', label: 'success', usage: '成功・完了' },
    { varName: '--color-warning', label: 'warning', usage: '注意' },
    { varName: '--color-danger', label: 'danger', usage: '危険・エラー' },
    { varName: '--color-bg', label: 'bg', usage: 'ページ下地' },
    { varName: '--color-surface', label: 'surface', usage: 'カード・パネル面' },
    { varName: '--color-border', label: 'border', usage: '境界線' },
    { varName: '--color-text-main', label: 'text-main', usage: '本文' },
    { varName: '--color-text-sub', label: 'text-sub', usage: '補助テキスト' },
  ];

  /** タイポグラフィ */
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
}
