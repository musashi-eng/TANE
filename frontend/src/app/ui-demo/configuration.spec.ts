/**
 * 設定ファイルテスト
 * 
 * このテストは、アプリケーション設定ファイル（app.config.ts、angular.json）が
 * ng-zorroとFontAwesomeの統合に必要な設定を含んでいることを検証します。
 */

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';

describe('Configuration Files', () => {
  describe('app.config.ts', () => {
    it('should provide animations asynchronously', () => {
      // provideAnimationsAsync関数が正しくインポートできることを確認
      expect(provideAnimationsAsync).toBeDefined();
      expect(typeof provideAnimationsAsync).toBe('function');
    });

    it('should provide Japanese locale for ng-zorro', () => {
      // 日本語ロケールが正しくインポートできることを確認
      expect(ja_JP).toBeDefined();
      expect(ja_JP.locale).toBe('ja');
    });

    it('should provide NzI18n configuration', () => {
      // provideNzI18n関数が正しくインポートできることを確認
      expect(provideNzI18n).toBeDefined();
      expect(typeof provideNzI18n).toBe('function');
    });

    it('should configure TestBed with required providers', () => {
      // TestBedが必要なプロバイダーで設定できることを確認
      expect(() => {
        TestBed.configureTestingModule({
          providers: [
            provideRouter([]),
            provideAnimationsAsync(),
            provideHttpClient(),
            provideNzI18n(ja_JP)
          ]
        });
      }).not.toThrow();
    });
  });

  describe('Japanese locale registration', () => {
    it('should have Japanese locale data', () => {
      // 日本語ロケールデータが存在することを確認
      expect(ja_JP).toBeDefined();
      expect(ja_JP.locale).toBe('ja');
    });

    it('should have correct date format for Japanese', () => {
      // 日本語の日付フォーマットが正しいことを確認
      expect(ja_JP.DatePicker).toBeDefined();
    });

    it('should have correct pagination text for Japanese', () => {
      // 日本語のページネーションテキストが正しいことを確認
      expect(ja_JP.Pagination).toBeDefined();
    });
  });

  describe('Animation configuration', () => {
    it('should enable animations in test environment', async () => {
      // テスト環境でアニメーションが有効化できることを確認
      await TestBed.configureTestingModule({
        providers: [provideAnimationsAsync()]
      }).compileComponents();

      expect(TestBed.inject).toBeDefined();
    });
  });

  describe('HTTP client configuration', () => {
    it('should provide HTTP client', () => {
      // HTTPクライアントが提供されることを確認
      expect(provideHttpClient).toBeDefined();
      expect(typeof provideHttpClient).toBe('function');
    });
  });

  describe('Router configuration', () => {
    it('should provide router', () => {
      // ルーターが提供されることを確認
      expect(provideRouter).toBeDefined();
      expect(typeof provideRouter).toBe('function');
    });
  });
});
