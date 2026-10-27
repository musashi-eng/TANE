import { Injectable, signal } from '@angular/core';

/**
 * テーマ（メインカラー）の共有状態。
 * shell がこの signal を effect で監視して :root の --color-primary を書き換え、
 * 各ページ（概要ページのカラー切替 UI）はこの signal を更新する。
 * primary を変えると styles.css の color-mix 式で hover/soft も追従する。
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** 現在のメインカラー（#rrggbb） */
  readonly primary = signal('#0095bc');

  /** #hex テキスト入力を正規化して反映（3桁/6桁、# 省略可。不正値は無視） */
  setHex(raw: string): void {
    let v = (raw || '').trim();
    if (v && !v.startsWith('#')) v = '#' + v;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
      this.primary.set(v.toLowerCase());
    }
  }
}
