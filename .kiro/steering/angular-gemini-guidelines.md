# Angular Gemini ガイドライン

このドキュメントは、TypeScript、Angular、スケーラブルなWebアプリケーション開発のベストプラクティスを定義します。機能的で保守性が高く、パフォーマンスに優れ、アクセシブルなコードを書くためのガイドラインです。

## TypeScript ベストプラクティス

- 厳密な型チェックを使用する
- 型が明白な場合は型推論を優先する
- `any`型を避ける。型が不確実な場合は`unknown`を使用する

## Angular ベストプラクティス

### コンポーネント設計

- NgModulesではなく、常にスタンドアロンコンポーネントを使用する
- Angularデコレーター内で`standalone: true`を設定してはいけない（Angular v20+ではデフォルト）
- 状態管理にはSignalsを使用する
- フィーチャールートには遅延ロードを実装する
- `@HostBinding`と`@HostListener`デコレーターを使用しない。代わりに`@Component`または`@Directive`デコレーターの`host`オブジェクト内にホストバインディングを配置する
- すべての静的画像には`NgOptimizedImage`を使用する
  - 注意: `NgOptimizedImage`はインラインbase64画像では動作しない

### コンポーネント開発

- コンポーネントは小さく、単一責任に焦点を当てる
- デコレーターの代わりに`input()`と`output()`関数を使用する
- 派生状態には`computed()`を使用する
- `@Component`デコレーターで`changeDetection: ChangeDetectionStrategy.OnPush`を設定する
- 小さなコンポーネントにはインラインテンプレートを優先する
- テンプレート駆動フォームではなく、リアクティブフォームを優先する
- `ngClass`を使用せず、`class`バインディングを使用する
- `ngStyle`を使用せず、`style`バインディングを使用する
- 外部テンプレート/スタイルを使用する場合は、コンポーネントTSファイルからの相対パスを使用する

## 状態管理

- ローカルコンポーネント状態にはSignalsを使用する
- 派生状態には`computed()`を使用する
- 状態変換は純粋で予測可能に保つ
- Signalsで`mutate`を使用せず、`update`または`set`を使用する

## テンプレート

- テンプレートはシンプルに保ち、複雑なロジックを避ける
- `*ngIf`、`*ngFor`、`*ngSwitch`の代わりに、ネイティブ制御フロー（`@if`、`@for`、`@switch`）を使用する
- Observableを処理するためにasyncパイプを使用する
- `new Date()`のようなグローバルが利用可能であると仮定しない
- テンプレート内でアロー関数を書かない（サポートされていない）

## サービス

- サービスは単一責任を中心に設計する
- シングルトンサービスには`providedIn: 'root'`オプションを使用する
- コンストラクタインジェクションの代わりに`inject()`関数を使用する

## アクセシビリティ要件

- すべてのAXEチェックに合格する必要がある
- フォーカス管理、色のコントラスト、ARIA属性を含むすべてのWCAG AA最小要件に従う必要がある

## コード例

### コンポーネントの基本構造

```typescript
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h1>{{ title() }}</h1>
      <p>{{ displayText() }}</p>
      <button (click)="handleClick()">Click me</button>
    </div>
  `
})
export class ExampleComponent {
  // Input/Output関数を使用
  title = input.required<string>();
  clicked = output<void>();
  
  // Signalsで状態管理
  count = signal(0);
  
  // Computed Signalで派生状態
  displayText = computed(() => `Count: ${this.count()}`);
  
  handleClick() {
    this.count.update(v => v + 1);
    this.clicked.emit();
  }
}
```

### サービスの基本構造

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // inject()関数を使用
  private http = inject(HttpClient);
  
  // Signalsで状態管理
  private _data = signal<Data[]>([]);
  data = this._data.asReadonly();
  
  loadData() {
    this.http.get<Data[]>('/api/data').subscribe(
      data => this._data.set(data)
    );
  }
}
```

### テンプレートの制御フロー

```html
<!-- ✅ 推奨: ネイティブ制御フロー -->
@if (isLoading()) {
  <p>Loading...</p>
} @else {
  <p>{{ data() }}</p>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ 非推奨: 古い構文 -->
<div *ngIf="isLoading">Loading...</div>
<div *ngFor="let item of items">{{ item.name }}</div>
```

### クラスとスタイルのバインディング

```html
<!-- ✅ 推奨: classバインディング -->
<div [class.active]="isActive()">Content</div>
<div [style.color]="textColor()">Text</div>

<!-- ❌ 非推奨: ngClass/ngStyle -->
<div [ngClass]="{'active': isActive}">Content</div>
<div [ngStyle]="{'color': textColor}">Text</div>
```

## まとめ

このガイドラインに従うことで、以下を実現できます：

- 型安全で保守性の高いコード
- パフォーマンスに優れたアプリケーション
- アクセシブルなユーザーインターフェース
- Angular 20+の最新機能を活用した開発

すべてのAngularコンポーネント、サービス、テンプレートはこのガイドラインに準拠する必要があります。
