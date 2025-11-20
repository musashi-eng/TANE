# 設計書

## 概要

本設計書は、TamaプロジェクトのフロントエンドにUI/UXライブラリを統合する機能の詳細設計を定義します。具体的には、ng-zorro-antd（Ant Design for Angular）とangular-fontawesome（FontAwesome for Angular）を導入し、Angular 20のZoneless + Signalsアーキテクチャに準拠した実装を行います。

この統合により、開発者は以下のメリットを享受できます：

- **統一されたUIコンポーネント**: Ant Designの豊富なコンポーネントライブラリを活用
- **視覚的な表現力**: FontAwesomeの多様なアイコンセットを使用
- **開発効率の向上**: 再利用可能なコンポーネントによる開発速度の向上
- **一貫性のあるデザイン**: プロジェクト全体で統一されたデザインシステム
- **Angular 20対応**: Standalone ComponentとSignalsを活用した最新のアーキテクチャ

## アーキテクチャ

### 全体構成

```
Frontend Application (Angular 20)
├── Core Configuration
│   ├── app.config.ts (グローバル設定)
│   ├── angular.json (ビルド設定)
│   └── tsconfig.json (TypeScript設定)
├── UI Libraries
│   ├── ng-zorro-antd (UIコンポーネント)
│   └── angular-fontawesome (アイコン)
├── Demo Components
│   └── ui-demo.component.ts (実装例)
└── Shared Components
    └── (将来的なカスタムコンポーネント)
```

### レイヤー構造

1. **設定レイヤー**: アプリケーション全体の設定とプロバイダー
2. **ライブラリレイヤー**: ng-zorroとFontAwesomeの統合
3. **コンポーネントレイヤー**: 実装例とカスタムコンポーネント
4. **スタイルレイヤー**: グローバルスタイルとテーマ設定


## コンポーネントとインターフェース

### 1. アプリケーション設定 (app.config.ts)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzI18n(ja_JP)
  ]
};
```

**責務**:
- Zoneless変更検知の有効化
- ng-zorroのアニメーション設定
- 日本語ロケールの設定
- HTTPクライアントの提供

### 2. デモコンポーネント (ui-demo.component.ts)

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHeart, 
  faUser, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular 
} from '@fortawesome/free-regular-svg-icons';
import { 
  faGithub, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    FontAwesomeModule
  ],
  templateUrl: './ui-demo.component.html',
  styleUrls: ['./ui-demo.component.less']
})
export class UiDemoComponent {
  // FontAwesomeアイコン
  faHeart = faHeart;
  faHeartRegular = faHeartRegular;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faGithub = faGithub;
  faTwitter = faTwitter;
  
  // Signals
  userName = signal('');
  email = signal('');
  tableData = signal([
    { id: 1, name: 'タスク1', status: '進行中' },
    { id: 2, name: 'タスク2', status: '完了' }
  ]);
}
```

**責務**:
- ng-zorroコンポーネントの使用例を提供
- FontAwesomeアイコンの使用例を提供
- Signalsを使用した状態管理の実装例を提供


### 3. Angular設定 (angular.json)

```json
{
  "projects": {
    "tama-frontend": {
      "schematics": {
        "@schematics/angular:component": {
          "style": "less"
        }
      },
      "architect": {
        "build": {
          "options": {
            "inlineStyleLanguage": "less",
            "styles": [
              "src/styles.less"
            ]
          }
        }
      }
    }
  }
}
```

**責務**:
- LESSをデフォルトのスタイル言語として設定
- ng-zorroのLESSファイルを直接インポートしてテーマカスタマイズを可能にする
- スタイルの読み込み順序を管理

### 4. パッケージ依存関係 (package.json)

```json
{
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/core": "^20.0.0",
    "ng-zorro-antd": "^20.0.0",
    "@fortawesome/angular-fontawesome": "^3.0.0",
    "@fortawesome/fontawesome-svg-core": "^7.1.0",
    "@fortawesome/free-solid-svg-icons": "^7.1.0",
    "@fortawesome/free-regular-svg-icons": "^7.1.0",
    "@fortawesome/free-brands-svg-icons": "^7.1.0"
  }
}
```

**責務**:
- 必要なライブラリのバージョン管理
- Angular 20との互換性保証

## データモデル

### FontAwesomeアイコン型

```typescript
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// アイコンスタイル
type IconStyle = 'solid' | 'regular' | 'brands';

// アイコン設定
interface IconConfig {
  icon: IconDefinition;
  style: IconStyle;
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2x' | '3x';
  color?: string;
}
```

### ng-zorroコンポーネント型

```typescript
// ボタンタイプ
type NzButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text';

// ボタンサイズ
type NzButtonSize = 'large' | 'default' | 'small';

// ボタン設定
interface ButtonConfig {
  type: NzButtonType;
  size: NzButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconDefinition;
}
```


## 正確性プロパティ

*プロパティとは、システムの全ての有効な実行において真であるべき特性や振る舞いのことです。本質的には、システムが何をすべきかについての形式的な記述です。プロパティは、人間が読める仕様と機械で検証可能な正確性保証の橋渡しとなります。*

### プロパティ1: ng-zorroコンポーネントのインポート可能性

*任意の*ng-zorroコンポーネントモジュールについて、Standalone Componentでインポートした場合、TypeScriptコンパイラはエラーを発生させずにコンパイルを完了すべきである

**検証要件: 1.4, 4.1**

**検証方法**:
- 主要なng-zorroコンポーネント（Button、Card、Form、Input、Table、Menu、Modal）をランダムに選択
- Standalone Componentでインポート
- TypeScriptコンパイラでコンパイル
- コンパイルエラーがないことを確認

### プロパティ2: FontAwesomeアイコンのレンダリング

*任意の*FontAwesomeアイコン（solid、regular、brands）について、コンポーネントテンプレートで使用した場合、レンダリングエラーを発生させずにDOM要素として表示されるべきである

**検証要件: 2.4, 2.5**

**検証方法**:
- 各スタイル（solid、regular、brands）からランダムにアイコンを選択
- テンプレートで`<fa-icon>`コンポーネントを使用
- コンポーネントをレンダリング
- DOM内に`<svg>`要素が存在することを確認
- コンソールエラーがないことを確認

### プロパティ3: ng-zorroとFontAwesomeの組み合わせ

*任意の*ng-zorroコンポーネントとFontAwesomeアイコンの組み合わせについて、同時に使用した場合、スタイルの競合やレンダリングエラーを発生させずに表示されるべきである

**検証要件: 3.4**

**検証方法**:
- ng-zorroコンポーネント（Button、Input、Card）をランダムに選択
- FontAwesomeアイコンをランダムに選択
- 組み合わせてレンダリング
- 両方の要素がDOM内に存在することを確認
- CSSスタイルが正しく適用されていることを確認
- コンソールエラーがないことを確認

### プロパティ4: Standalone Componentでの独立性

*任意の*複数のStandalone Componentについて、同じng-zorroコンポーネントをそれぞれインポートした場合、各コンポーネントは独立して動作し、相互に影響を与えないべきである

**検証要件: 4.4**

**検証方法**:
- 複数のStandalone Componentを作成
- 各コンポーネントで同じng-zorroコンポーネント（例: NzButtonModule）をインポート
- 各コンポーネントを同時にレンダリング
- 各コンポーネントのボタンが独立して動作することを確認
- 一方のコンポーネントの状態変更が他方に影響しないことを確認

### プロパティ5: グローバル設定の有効性

*任意の*コンポーネントについて、app.config.tsでng-zorroのプロバイダーを設定した後、そのコンポーネントはng-zorroの機能（アニメーション、i18n）を使用できるべきである

**検証要件: 4.3**

**検証方法**:
- app.config.tsでprovideAnimationsAsync()とprovideNzI18n(ja_JP)を設定
- ランダムなコンポーネントでng-zorroのアニメーション機能を使用
- 日本語ロケールが適用されていることを確認（例: DatePickerの表示）
- アニメーションが正しく動作することを確認


## エラーハンドリング

### 1. インストールエラー

**エラーケース**: npm installでバージョン競合が発生

**対処方法**:
```bash
# package-lock.jsonを削除して再インストール
docker compose exec frontend rm -f package-lock.json
docker compose exec frontend npm install
```

**予防策**:
- package.jsonで互換性のあるバージョンを指定
- Angular 20と互換性のあるライブラリバージョンを使用

### 2. コンパイルエラー

**エラーケース**: ng-zorroコンポーネントのインポートでTypeScriptエラー

**対処方法**:
```typescript
// ❌ 間違い: モジュール全体をインポート
import * as NzButton from 'ng-zorro-antd/button';

// ✅ 正しい: 必要なモジュールのみインポート
import { NzButtonModule } from 'ng-zorro-antd/button';
```

**予防策**:
- Standalone Componentのimportsセクションに正しくモジュールを追加
- TypeScriptの型定義を確認

### 3. スタイル未適用エラー

**エラーケース**: ng-zorroコンポーネントのスタイルが適用されない

**対処方法**:
```json
// angular.jsonのstylesセクションを確認
{
  "styles": [
    "src/styles.scss",
    "node_modules/ng-zorro-antd/ng-zorro-antd.min.css"
  ]
}
```

**予防策**:
- angular.jsonで正しくスタイルを読み込む
- ビルド後にスタイルが含まれていることを確認

### 4. アニメーションエラー

**エラーケース**: ng-zorroのアニメーションが動作しない

**対処方法**:
```typescript
// app.config.tsでアニメーションを有効化
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(), // これを追加
    // ...
  ]
};
```

**予防策**:
- app.config.tsで必ずprovideAnimationsAsync()を設定
- Zonelessモードでもアニメーションが動作することを確認

### 5. FontAwesomeアイコン表示エラー

**エラーケース**: アイコンが表示されない

**対処方法**:
```typescript
// コンポーネントでアイコンを正しくインポート
import { faUser } from '@fortawesome/free-solid-svg-icons';

export class MyComponent {
  faUser = faUser; // クラスプロパティとして定義
}
```

```html
<!-- テンプレートで使用 -->
<fa-icon [icon]="faUser"></fa-icon>
```

**予防策**:
- FontAwesomeModuleをコンポーネントのimportsに追加
- アイコンをクラスプロパティとして定義
- 正しいパッケージからインポート（solid、regular、brands）

### 6. Docker環境でのビルドエラー

**エラーケース**: Dockerコンテナ内でビルドが失敗

**対処方法**:
```bash
# node_modulesを削除して再インストール
docker compose exec frontend rm -rf node_modules
docker compose exec frontend npm install

# キャッシュをクリアしてビルド
docker compose exec frontend npm run build -- --no-cache
```

**予防策**:
- Dockerfileで正しくnode_modulesをインストール
- .dockerignoreでnode_modulesを除外


## テスト戦略

### プロパティベーステスト

このプロジェクトでは、**fast-check**ライブラリを使用してプロパティベーステストを実装します。各テストは最低100回の反復を実行し、ランダムな入力に対してプロパティが成り立つことを検証します。

#### 使用ライブラリ

- **fast-check**: TypeScript/JavaScript向けのプロパティベーステストライブラリ
- **@angular/core/testing**: Angularコンポーネントのテストユーティリティ
- **Jasmine**: テストフレームワーク

#### テスト設定

```typescript
import * as fc from 'fast-check';

// 各テストは最低100回の反復を実行
const TEST_RUNS = 100;

describe('UI Library Integration Property Tests', () => {
  it('should pass property test', () => {
    fc.assert(
      fc.property(
        // ジェネレーター
        fc.string(),
        // プロパティ検証
        (input) => {
          // テストロジック
          return true;
        }
      ),
      { numRuns: TEST_RUNS }
    );
  });
});
```

#### プロパティテスト1: ng-zorroコンポーネントのインポート可能性

```typescript
/**
 * Feature: ui-library-integration, Property 1: ng-zorroコンポーネントのインポート可能性
 * Validates: Requirements 1.4, 4.1
 */
describe('Property 1: ng-zorro component import', () => {
  it('should compile any ng-zorro component without errors', () => {
    const nzComponents = [
      'NzButtonModule',
      'NzCardModule',
      'NzFormModule',
      'NzInputModule',
      'NzTableModule',
      'NzMenuModule',
      'NzModalModule'
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...nzComponents),
        (componentName) => {
          // コンポーネントを動的にインポートしてコンパイル
          // TypeScriptコンパイラでエラーがないことを確認
          return compileComponent(componentName);
        }
      ),
      { numRuns: TEST_RUNS }
    );
  });
});
```

#### プロパティテスト2: FontAwesomeアイコンのレンダリング

```typescript
/**
 * Feature: ui-library-integration, Property 2: FontAwesomeアイコンのレンダリング
 * Validates: Requirements 2.4, 2.5
 */
describe('Property 2: FontAwesome icon rendering', () => {
  it('should render any FontAwesome icon without errors', () => {
    const iconStyles = ['solid', 'regular', 'brands'] as const;
    
    fc.assert(
      fc.property(
        fc.constantFrom(...iconStyles),
        fc.string({ minLength: 2, maxLength: 20 }),
        (style, iconName) => {
          // アイコンをレンダリング
          const fixture = renderIcon(style, iconName);
          
          // SVG要素が存在することを確認
          const svg = fixture.nativeElement.querySelector('svg');
          expect(svg).toBeTruthy();
          
          // コンソールエラーがないことを確認
          expect(getConsoleErrors()).toHaveLength(0);
          
          return true;
        }
      ),
      { numRuns: TEST_RUNS }
    );
  });
});
```

#### プロパティテスト3: ng-zorroとFontAwesomeの組み合わせ

```typescript
/**
 * Feature: ui-library-integration, Property 3: ng-zorroとFontAwesomeの組み合わせ
 * Validates: Requirements 3.4
 */
describe('Property 3: ng-zorro and FontAwesome combination', () => {
  it('should render ng-zorro components with FontAwesome icons without conflicts', () => {
    const nzComponents = ['button', 'input', 'card'];
    const icons = ['faUser', 'faHeart', 'faEnvelope'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...nzComponents),
        fc.constantFrom(...icons),
        (component, icon) => {
          // ng-zorroコンポーネントとアイコンを組み合わせてレンダリング
          const fixture = renderCombination(component, icon);
          
          // 両方の要素が存在することを確認
          const nzElement = fixture.nativeElement.querySelector(`[nz-${component}]`);
          const iconElement = fixture.nativeElement.querySelector('fa-icon');
          
          expect(nzElement).toBeTruthy();
          expect(iconElement).toBeTruthy();
          
          // スタイル競合がないことを確認
          expect(hasStyleConflicts(fixture)).toBe(false);
          
          return true;
        }
      ),
      { numRuns: TEST_RUNS }
    );
  });
});
```

#### プロパティテスト4: Standalone Componentでの独立性

```typescript
/**
 * Feature: ui-library-integration, Property 4: Standalone Componentでの独立性
 * Validates: Requirements 4.4
 */
describe('Property 4: Standalone component independence', () => {
  it('should maintain independence across multiple standalone components', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }),
        (componentCount) => {
          // 複数のStandalone Componentを作成
          const components = createMultipleComponents(componentCount);
          
          // 各コンポーネントで同じng-zorroコンポーネントを使用
          components.forEach(comp => {
            comp.imports = [NzButtonModule];
          });
          
          // 全てのコンポーネントをレンダリング
          const fixtures = components.map(comp => renderComponent(comp));
          
          // 各コンポーネントが独立して動作することを確認
          fixtures.forEach((fixture, index) => {
            const button = fixture.nativeElement.querySelector('button');
            expect(button).toBeTruthy();
            
            // 状態変更が他のコンポーネントに影響しないことを確認
            button.click();
            fixtures.forEach((otherFixture, otherIndex) => {
              if (index !== otherIndex) {
                expect(otherFixture.componentInstance.state).toBe('initial');
              }
            });
          });
          
          return true;
        }
      ),
      { numRuns: TEST_RUNS }
    );
  });
});
```

#### プロパティテスト5: グローバル設定の有効性

```typescript
/**
 * Feature: ui-library-integration, Property 5: グローバル設定の有効性
 * Validates: Requirements 4.3
 */
describe('Property 5: Global configuration effectiveness', () => {
  it('should enable ng-zorro features in any component after configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'datepicker', 'modal', 'select'),
        (componentType) => {
          // app.config.tsでグローバル設定を適用
          configureApp();
          
          // ランダムなコンポーネントを作成
          const fixture = createComponentWithNzFeature(componentType);
          
          // アニメーションが有効であることを確認
          expect(isAnimationEnabled(fixture)).toBe(true);
          
          // 日本語ロケールが適用されていることを確認
          if (componentType === 'datepicker') {
            const locale = getLocale(fixture);
            expect(locale).toBe('ja_JP');
          }
          
          return true;
        }
      ),
      { numRuns: TEST_RUNS }
    );
  });
});
```


### 単体テスト

プロパティベーステストに加えて、以下の単体テストを実装します。

#### 1. パッケージインストールテスト

```typescript
describe('Package Installation', () => {
  it('should have ng-zorro-antd in package.json', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.dependencies['ng-zorro-antd']).toBeDefined();
    expect(packageJson.dependencies['ng-zorro-antd']).toMatch(/^(\^|~)?20\./);
  });
  
  it('should have all FontAwesome packages in package.json', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.dependencies['@fortawesome/angular-fontawesome']).toBeDefined();
    expect(packageJson.dependencies['@fortawesome/fontawesome-svg-core']).toBeDefined();
    expect(packageJson.dependencies['@fortawesome/free-solid-svg-icons']).toBeDefined();
    expect(packageJson.dependencies['@fortawesome/free-regular-svg-icons']).toBeDefined();
    expect(packageJson.dependencies['@fortawesome/free-brands-svg-icons']).toBeDefined();
  });
});
```

#### 2. 設定ファイルテスト

```typescript
describe('Configuration Files', () => {
  it('should include ng-zorro styles in angular.json', () => {
    const angularJson = require('../../angular.json');
    const styles = angularJson.projects['tama-frontend'].architect.build.options.styles;
    expect(styles).toContain('node_modules/ng-zorro-antd/ng-zorro-antd.min.css');
  });
  
  it('should configure animations in app.config.ts', () => {
    const appConfig = require('./app.config');
    const hasAnimations = appConfig.appConfig.providers.some(
      p => p.toString().includes('provideAnimationsAsync')
    );
    expect(hasAnimations).toBe(true);
  });
  
  it('should configure Japanese locale in app.config.ts', () => {
    const appConfig = require('./app.config');
    const hasJaLocale = appConfig.appConfig.providers.some(
      p => p.toString().includes('ja_JP')
    );
    expect(hasJaLocale).toBe(true);
  });
});
```

#### 3. デモコンポーネントテスト

```typescript
describe('UiDemoComponent', () => {
  let component: UiDemoComponent;
  let fixture: ComponentFixture<UiDemoComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDemoComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UiDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render ng-zorro buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button[nz-button]');
    expect(buttons.length).toBeGreaterThan(0);
  });
  
  it('should render FontAwesome icons', () => {
    const icons = fixture.nativeElement.querySelectorAll('fa-icon');
    expect(icons.length).toBeGreaterThan(0);
  });
  
  it('should render ng-zorro card', () => {
    const card = fixture.nativeElement.querySelector('nz-card');
    expect(card).toBeTruthy();
  });
  
  it('should render ng-zorro table', () => {
    const table = fixture.nativeElement.querySelector('nz-table');
    expect(table).toBeTruthy();
  });
  
  it('should use Signals for state management', () => {
    expect(component.userName).toBeDefined();
    expect(component.email).toBeDefined();
    expect(component.tableData).toBeDefined();
    
    // Signalsの型チェック
    expect(typeof component.userName()).toBe('string');
    expect(typeof component.email()).toBe('string');
    expect(Array.isArray(component.tableData())).toBe(true);
  });
});
```

#### 4. スタイル適用テスト

```typescript
describe('Style Application', () => {
  it('should apply Ant Design styles to buttons', () => {
    const fixture = TestBed.createComponent(UiDemoComponent);
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[nz-button]');
    const styles = window.getComputedStyle(button);
    
    // Ant Designのスタイルが適用されていることを確認
    expect(styles.getPropertyValue('border-radius')).toBeTruthy();
    expect(styles.getPropertyValue('padding')).toBeTruthy();
  });
  
  it('should not have style conflicts between ng-zorro and FontAwesome', () => {
    const fixture = TestBed.createComponent(UiDemoComponent);
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button[nz-button]');
    const icon = button.querySelector('fa-icon');
    
    // 両方の要素が正しく表示されていることを確認
    expect(button).toBeTruthy();
    expect(icon).toBeTruthy();
    
    // アイコンのサイズが正しいことを確認
    const iconStyles = window.getComputedStyle(icon);
    expect(iconStyles.getPropertyValue('display')).not.toBe('none');
  });
});
```

### 統合テスト

#### Docker環境でのビルドテスト

```bash
#!/bin/bash
# tests/integration/test-ui-libraries.sh

# Dockerコンテナを起動
docker compose up -d frontend

# 依存関係のインストールを確認
docker compose exec frontend npm list ng-zorro-antd
docker compose exec frontend npm list @fortawesome/angular-fontawesome

# ビルドが成功することを確認
docker compose exec frontend npm run build

# 開発サーバーが起動することを確認
docker compose exec frontend npm start &
sleep 10

# アプリケーションにアクセスできることを確認
curl -f http://localhost:4200 || exit 1

echo "All integration tests passed!"
```

### テスト実行方法

```bash
# 単体テスト実行
docker compose exec frontend npm test

# プロパティベーステスト実行
docker compose exec frontend npm test -- --include='**/*.property.spec.ts'

# 統合テスト実行
bash tests/integration/test-ui-libraries.sh

# カバレッジレポート生成
docker compose exec frontend npm test -- --code-coverage
```


## 実装の詳細

### 1. インストール手順

```bash
# フロントエンドコンテナ内でパッケージをインストール
docker compose exec frontend npm install ng-zorro-antd@^20.0.0
docker compose exec frontend npm install @fortawesome/angular-fontawesome@^3.0.0
docker compose exec frontend npm install @fortawesome/fontawesome-svg-core@^7.1.0
docker compose exec frontend npm install @fortawesome/free-solid-svg-icons@^7.1.0
docker compose exec frontend npm install @fortawesome/free-regular-svg-icons@^7.1.0
docker compose exec frontend npm install @fortawesome/free-brands-svg-icons@^7.1.0

# LESSサポートをインストール（ng-zorroのテーマカスタマイズ用）
docker compose exec frontend npm install --save-dev less
```

### 2. app.config.ts の設定

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';

// 日本語ロケールデータを登録
registerLocaleData(ja);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzI18n(ja_JP)
  ]
};
```

### 3. angular.json の設定

```json
{
  "projects": {
    "tama-frontend": {
      "schematics": {
        "@schematics/angular:component": {
          "style": "less"
        }
      },
      "architect": {
        "build": {
          "options": {
            "inlineStyleLanguage": "less",
            "styles": [
              "src/styles.less"
            ]
          }
        }
      }
    }
  }
}
```

### 3.1. styles.less の設定

ng-zorroのテーマをカスタマイズできるように、LESSファイルで直接ng-zorroのスタイルをインポートします。

```less
// グローバルスタイル
// ng-zorroのテーマをカスタマイズ可能にするためLESSを使用

// ng-zorroのテーマ変数をインポート
@import "../node_modules/ng-zorro-antd/ng-zorro-antd.less";

// カスタムテーマ変数（必要に応じて上書き）
// @primary-color: #1890ff; // プライマリカラー
// @link-color: #1890ff; // リンクカラー
// @success-color: #52c41a; // 成功カラー
// @warning-color: #faad14; // 警告カラー
// @error-color: #f5222d; // エラーカラー
// @font-size-base: 14px; // ベースフォントサイズ
// @heading-color: rgba(0, 0, 0, 0.85); // 見出しカラー
// @text-color: rgba(0, 0, 0, 0.65); // テキストカラー

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f0f2f5;
}
```

**テーマカスタマイズ方法**:
- コメントアウトされている変数を有効にして値を変更するだけで、ng-zorroのテーマをカスタマイズできます
- 例: `@primary-color: #ff6b6b;` でプライマリカラーを変更

### 4. デモコンポーネントの実装

#### ui-demo.component.ts

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHeart, 
  faUser, 
  faEnvelope,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular,
  faCircle
} from '@fortawesome/free-regular-svg-icons';
import { 
  faGithub, 
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

interface TableData {
  id: number;
  name: string;
  status: string;
  priority: string;
}

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    FontAwesomeModule
  ],
  templateUrl: './ui-demo.component.html',
  styleUrls: ['./ui-demo.component.less']
})
export class UiDemoComponent {
  // FontAwesome Solid Icons
  faHeart = faHeart;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCheck = faCheck;
  faTimes = faTimes;
  
  // FontAwesome Regular Icons
  faHeartRegular = faHeartRegular;
  faCircle = faCircle;
  
  // FontAwesome Brands Icons
  faGithub = faGithub;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  
  // Signals for state management
  userName = signal('');
  email = signal('');
  isLoading = signal(false);
  
  tableData = signal<TableData[]>([
    { id: 1, name: 'タスク1', status: '進行中', priority: '高' },
    { id: 2, name: 'タスク2', status: '完了', priority: '中' },
    { id: 3, name: 'タスク3', status: '未着手', priority: '低' }
  ]);
  
  // メソッド
  handleSubmit() {
    this.isLoading.set(true);
    console.log('ユーザー名:', this.userName());
    console.log('メール:', this.email());
    
    // 模擬的な非同期処理
    setTimeout(() => {
      this.isLoading.set(false);
      alert('送信完了！');
    }, 1000);
  }
  
  handleButtonClick(type: string) {
    console.log(`${type}ボタンがクリックされました`);
  }
}
```

#### ui-demo.component.html

```html
<div class="ui-demo-container">
  <h1>UI Library Integration Demo</h1>
  
  <!-- ボタンセクション -->
  <nz-card nzTitle="ボタンの例">
    <div class="button-group">
      <button nz-button nzType="primary" (click)="handleButtonClick('primary')">
        <fa-icon [icon]="faCheck"></fa-icon>
        Primary Button
      </button>
      
      <button nz-button nzType="default" (click)="handleButtonClick('default')">
        <fa-icon [icon]="faUser"></fa-icon>
        Default Button
      </button>
      
      <button nz-button nzType="dashed" (click)="handleButtonClick('dashed')">
        <fa-icon [icon]="faEnvelope"></fa-icon>
        Dashed Button
      </button>
      
      <button nz-button nzType="link" (click)="handleButtonClick('link')">
        <fa-icon [icon]="faHeart"></fa-icon>
        Link Button
      </button>
    </div>
  </nz-card>
  
  <!-- アイコンセクション -->
  <nz-card nzTitle="FontAwesome アイコンの例">
    <div class="icon-group">
      <div class="icon-item">
        <fa-icon [icon]="faHeart" size="2x"></fa-icon>
        <span>Solid Heart</span>
      </div>
      
      <div class="icon-item">
        <fa-icon [icon]="faHeartRegular" size="2x"></fa-icon>
        <span>Regular Heart</span>
      </div>
      
      <div class="icon-item">
        <fa-icon [icon]="faGithub" size="2x"></fa-icon>
        <span>GitHub</span>
      </div>
      
      <div class="icon-item">
        <fa-icon [icon]="faTwitter" size="2x"></fa-icon>
        <span>Twitter</span>
      </div>
      
      <div class="icon-item">
        <fa-icon [icon]="faLinkedin" size="2x"></fa-icon>
        <span>LinkedIn</span>
      </div>
    </div>
  </nz-card>
  
  <!-- フォームセクション -->
  <nz-card nzTitle="フォームの例">
    <form nz-form>
      <nz-form-item>
        <nz-form-label>ユーザー名</nz-form-label>
        <nz-form-control>
          <nz-input-group [nzPrefix]="userIcon">
            <input 
              nz-input 
              placeholder="ユーザー名を入力"
              [value]="userName()"
              (input)="userName.set($any($event.target).value)"
            />
          </nz-input-group>
          <ng-template #userIcon>
            <fa-icon [icon]="faUser"></fa-icon>
          </ng-template>
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-label>メールアドレス</nz-form-label>
        <nz-form-control>
          <nz-input-group [nzPrefix]="emailIcon">
            <input 
              nz-input 
              placeholder="メールアドレスを入力"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
            />
          </nz-input-group>
          <ng-template #emailIcon>
            <fa-icon [icon]="faEnvelope"></fa-icon>
          </ng-template>
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-control>
          <button 
            nz-button 
            nzType="primary" 
            [nzLoading]="isLoading()"
            (click)="handleSubmit()"
          >
            <fa-icon [icon]="faCheck"></fa-icon>
            送信
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  </nz-card>
  
  <!-- テーブルセクション -->
  <nz-card nzTitle="テーブルの例">
    <nz-table [nzData]="tableData()">
      <thead>
        <tr>
          <th>ID</th>
          <th>タスク名</th>
          <th>ステータス</th>
          <th>優先度</th>
        </tr>
      </thead>
      <tbody>
        @for (data of tableData(); track data.id) {
          <tr>
            <td>{{ data.id }}</td>
            <td>
              <fa-icon [icon]="faCircle"></fa-icon>
              {{ data.name }}
            </td>
            <td>{{ data.status }}</td>
            <td>{{ data.priority }}</td>
          </tr>
        }
      </tbody>
    </nz-table>
  </nz-card>
</div>
```

#### ui-demo.component.less

```less
.ui-demo-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  
  // レスポンシブ対応
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
  
  h1 {
    margin-bottom: 24px;
    font-size: 28px;
    font-weight: bold;
    color: #262626;
    
    @media (max-width: 480px) {
      font-size: 24px;
      margin-bottom: 16px;
    }
  }
  
  nz-card {
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    
    // ng-zorroの内部スタイルをカスタマイズ
    /deep/ .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
    }
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    
    button {
      fa-icon {
        margin-right: 8px;
        vertical-align: middle;
        font-size: 14px;
        line-height: 1;
      }
      
      @media (max-width: 480px) {
        flex: 1 1 100%;
        min-width: 100%;
      }
    }
  }
  
  .icon-group {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: flex-start;
    
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 80px;
      
      fa-icon {
        color: #1890ff;
        transition: color 0.3s ease;
        display: inline-block;
        
        &:hover {
          color: #40a9ff;
        }
      }
      
      span {
        font-size: 12px;
        color: #666;
        text-align: center;
      }
    }
  }
}

// スタイル競合防止
:host {
  display: block;
  
  fa-icon {
    svg {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
```

### 5. ルーティング設定

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { UiDemoComponent } from './ui-demo/ui-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/demo', pathMatch: 'full' },
  { path: 'demo', component: UiDemoComponent }
];
```

## パフォーマンス考慮事項

### 1. Tree Shaking

ng-zorroとFontAwesomeは、必要なモジュールのみをインポートすることでバンドルサイズを最小化できます。

```typescript
// ❌ 悪い例: 全てをインポート
import * as AllIcons from '@fortawesome/free-solid-svg-icons';

// ✅ 良い例: 必要なアイコンのみインポート
import { faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
```

### 2. Lazy Loading

大規模なアプリケーションでは、ng-zorroコンポーネントを遅延読み込みすることを検討します。

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
  }
];
```

### 3. アニメーションの最適化

Zonelessモードでは、アニメーションのパフォーマンスが向上します。`provideAnimationsAsync()`を使用することで、アニメーションを非同期で読み込みます。

```typescript
// app.config.ts
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(), // 非同期でアニメーションを読み込む
    // ...
  ]
};
```

## セキュリティ考慮事項

### 1. XSS対策

ng-zorroとFontAwesomeは、Angularのセキュリティ機能を活用しています。ユーザー入力を表示する際は、必ずAngularのサニタイゼーションを使用します。

```typescript
// ✅ 安全: Angularが自動的にサニタイズ
<div>{{ userInput() }}</div>

// ❌ 危険: innerHTML を使用しない
<div [innerHTML]="userInput()"></div>
```

### 2. 依存関係の更新

定期的にライブラリを最新バージョンに更新し、セキュリティパッチを適用します。

```bash
# 依存関係の脆弱性チェック
docker compose exec frontend npm audit

# 脆弱性の修正
docker compose exec frontend npm audit fix
```

## まとめ

この設計書では、ng-zorro-antdとangular-fontawesomeをTamaプロジェクトに統合するための詳細な設計を定義しました。主なポイントは以下の通りです：

- **Angular 20対応**: Zoneless + Signalsアーキテクチャに準拠
- **Standalone Component**: NgModuleを使用しない最新のアーキテクチャ
- **LESSによるテーマカスタマイズ**: ng-zorroのLESSファイルを直接インポートし、テーマ変数を上書き可能
- **レスポンシブデザイン**: デスクトップ、タブレット、モバイルに対応したスタイル実装
- **プロパティベーステスト**: fast-checkを使用した包括的なテスト戦略
- **日本語対応**: ロケール設定とドキュメントの日本語化
- **実装例**: デモコンポーネントによる具体的な使用方法の提示
- **Docker環境**: コンテナ内での開発とテストの実行

この設計に従うことで、一貫性のある美しいUIを効率的に構築でき、将来的なテーマカスタマイズも容易に行える開発環境が整備されます。
