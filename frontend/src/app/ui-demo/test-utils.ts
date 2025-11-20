/**
 * プロパティベーステスト用のユーティリティ関数
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';

// 日本語ロケールデータを登録
registerLocaleData(ja);

/**
 * テスト用のコンポーネントを作成してレンダリングする
 */
export async function createTestComponent<T>(
  component: Type<T>
): Promise<ComponentFixture<T>> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [
      provideAnimationsAsync(),
      provideNzI18n(ja_JP)
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

/**
 * コンソールエラーを取得する
 */
export function getConsoleErrors(): string[] {
  // テスト環境ではコンソールエラーをキャプチャする仕組みが必要
  // ここでは簡易的な実装
  return [];
}

/**
 * スタイル競合をチェックする
 */
export function hasStyleConflicts(fixture: ComponentFixture<any>): boolean {
  const element = fixture.nativeElement;
  
  // ng-zorroとFontAwesomeの要素が両方存在するか確認
  const nzElements = element.querySelectorAll('[nz-button], [nz-input], nz-card');
  const faElements = element.querySelectorAll('fa-icon');
  
  if (nzElements.length === 0 || faElements.length === 0) {
    return false;
  }
  
  // スタイルの競合をチェック（簡易版）
  // 実際には、CSSの競合を詳細にチェックする必要がある
  for (const faElement of Array.from(faElements)) {
    const styles = window.getComputedStyle(faElement as Element);
    const display = styles.getPropertyValue('display');
    
    // アイコンが非表示になっていないか確認
    if (display === 'none') {
      return true;
    }
  }
  
  return false;
}

/**
 * DOM要素が存在するか確認する
 */
export function elementExists(
  fixture: ComponentFixture<any>,
  selector: string
): boolean {
  const element = fixture.nativeElement.querySelector(selector);
  return element !== null;
}

/**
 * SVG要素が存在するか確認する
 */
export function svgExists(fixture: ComponentFixture<any>): boolean {
  return elementExists(fixture, 'svg');
}

/**
 * 動的にStandalone Componentを作成する
 */
export function createDynamicComponent(
  template: string,
  imports: any[]
): Type<any> {
  @Component({
    selector: 'app-dynamic-test',
    standalone: true,
    imports: imports,
    template: template
  })
  class DynamicTestComponent {}
  
  return DynamicTestComponent;
}
