// Vitestのグローバル設定
import { expect, vi } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// グローバルなexpectとviを設定（型安全な方法）
(globalThis as any).expect = expect;
(globalThis as any).vi = vi;

// Angular TestBedの初期化
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
