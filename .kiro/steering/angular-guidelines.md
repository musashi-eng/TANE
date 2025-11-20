---
inclusion: always
---

# Angular 開発ガイドライン

このドキュメントでは、Taneプロジェクトで使用するAngular 20の開発ガイドラインを定義します。

## アーキテクチャ方針

### Zoneless + Signals アーキテクチャ

このプロジェクトは、Angular 20の最新機能である**Zoneless**モードと**Signals**を採用しています。

#### なぜZonelessなのか？

1. **パフォーマンス向上**: Zone.jsのオーバーヘッドがなくなり、変更検知が高速化
2. **バンドルサイズ削減**: Zone.jsの依存がないため、約50KB削減
3. **予測可能性**: 明示的な変更検知により、デバッグが容易
4. **将来性**: Angularの推奨方向性に沿った実装

#### なぜSignalsなのか？

1. **シンプルな状態管理**: RxJSよりも学習コストが低い
2. **細かい粒度の変更検知**: 必要な部分だけを更新
3. **型安全性**: TypeScriptとの相性が良い
4. **パフォーマンス**: 不要な再レンダリングを削減

## コンポーネント開発

### 基本構造

すべてのコンポーネントは以下の構造に従ってください：

```typescript
import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  // Input Signals（親から受け取るデータ）
  userId = input.required<string>();
  userName = input<string>('Guest');
  
  // Output Signals（親に通知するイベント）
  userSelected = output<string>();
  
  // 内部状態（Signals）
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Computed Signals（派生値）
  displayName = computed(() => {
    return `User: ${this.userName()}`;
  });
  
  // メソッド
  handleClick() {
    this.userSelected.emit(this.userId());
  }
}
```

### Signalsの使い分け

#### signal() - 基本的な状態

```typescript
// 単純な値
const count = signal(0);
const name = signal('John');
const isActive = signal(true);

// オブジェクト
const user = signal({ id: 1, name: 'John' });

// 配列
const items = signal<string[]>([]);
```

#### computed() - 派生値

```typescript
// 他のSignalから計算される値
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

// 複雑な計算
const items = signal([1, 2, 3, 4, 5]);
const total = computed(() => items().reduce((sum, item) => sum + item, 0));
const average = computed(() => total() / items().length);
```

#### effect() - 副作用

```typescript
// ログ出力
effect(() => {
  console.log('Count changed:', count());
});

// ローカルストレージへの保存
effect(() => {
  localStorage.setItem('user', JSON.stringify(user()));
});

// 注意: effectは最小限に使用すること
// 多くの場合、computedで十分
```

### Input/Output Signals

Angular 20では、`@Input()`と`@Output()`の代わりに、`input()`と`output()`を使用します。

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <p>{{ title() }}</p>
      <button (click)="handleClick()">Click</button>
    </div>
  `
})
export class ChildComponent {
  // Input Signal（必須）
  title = input.required<string>();
  
  // Input Signal（オプション、デフォルト値あり）
  subtitle = input<string>('Default subtitle');
  
  // Output Signal
  clicked = output<void>();
  
  handleClick() {
    this.clicked.emit();
  }
}
```

親コンポーネントでの使用：

```typescript
@Component({
  template: `
    <app-child 
      [title]="pageTitle()" 
      [subtitle]="pageSubtitle()"
      (clicked)="onChildClicked()" />
  `
})
export class ParentComponent {
  pageTitle = signal('Welcome');
  pageSubtitle = signal('Hello World');
  
  onChildClicked() {
    console.log('Child clicked!');
  }
}
```

## 状態管理

### コンポーネントレベルの状態

単一コンポーネント内の状態は、Signalsで管理します。

```typescript
export class TodoComponent {
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');
  
  filteredTodos = computed(() => {
    const todos = this.todos();
    const filter = this.filter();
    
    if (filter === 'active') {
      return todos.filter(t => !t.completed);
    }
    if (filter === 'completed') {
      return todos.filter(t => t.completed);
    }
    return todos;
  });
  
  addTodo(text: string) {
    this.todos.update(todos => [...todos, { id: Date.now(), text, completed: false }]);
  }
  
  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }
}
```

### サービスレベルの状態

複数のコンポーネントで共有する状態は、Serviceで管理します。

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // プライベートなSignal
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  
  // 読み取り専用のSignal（asReadonly()を使用）
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  
  // Computed Signal
  userName = computed(() => this._currentUser()?.name ?? 'Guest');
  
  // メソッド
  login(user: User) {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }
  
  logout() {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
}
```

## HTTPリクエストとSignals

### toSignal()の使用

ObservableをSignalに変換する場合は、`toSignal()`を使用します。

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  template: `
    @if (users(); as userList) {
      <ul>
        @for (user of userList; track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    } @else {
      <p>Loading...</p>
    }
  `
})
export class UsersComponent {
  private http = inject(HttpClient);
  
  // ObservableをSignalに変換
  users = toSignal(
    this.http.get<User[]>('/api/users'),
    { initialValue: [] }
  );
}
```

### 手動でのHTTPリクエスト管理

より細かい制御が必要な場合は、手動で管理します。

```typescript
export class UsersComponent {
  private http = inject(HttpClient);
  
  users = signal<User[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  loadUsers() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}
```

## テンプレート構文

### 新しい制御フロー構文

Angular 20では、新しい制御フロー構文（`@if`, `@for`, `@switch`）を使用します。

```html
<!-- 条件分岐 -->
@if (isLoading()) {
  <p>Loading...</p>
} @else if (error()) {
  <p>Error: {{ error() }}</p>
} @else {
  <p>Data loaded!</p>
}

<!-- ループ -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found</p>
}

<!-- Switch -->
@switch (status()) {
  @case ('loading') {
    <p>Loading...</p>
  }
  @case ('success') {
    <p>Success!</p>
  }
  @case ('error') {
    <p>Error!</p>
  }
  @default {
    <p>Unknown status</p>
  }
}
```

### Signalsの呼び出し

テンプレートでSignalを使用する際は、必ず`()`を付けて呼び出します。

```html
<!-- ✅ 正しい -->
<h1>{{ title() }}</h1>
<p>Count: {{ count() }}</p>
<div [class.active]="isActive()">Content</div>

<!-- ❌ 間違い -->
<h1>{{ title }}</h1>
<p>Count: {{ count }}</p>
```

## フォーム処理

### Reactive Forms with Signals

```typescript
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
    
    @if (submitStatus(); as status) {
      <p>{{ status }}</p>
    }
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  submitStatus = signal<string | null>(null);
  
  onSubmit() {
    if (this.form.valid) {
      this.submitStatus.set('Submitting...');
      // API呼び出し
      // ...
      this.submitStatus.set('Success!');
    }
  }
}
```

## パフォーマンス最適化

### trackBy関数

`@for`ループでは、必ず`track`を指定します。

```html
<!-- ✅ 推奨: trackを使用 -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ 非推奨: trackなし（パフォーマンス低下） -->
@for (item of items(); track $index) {
  <div>{{ item.name }}</div>
}
```

### Computed Signalsの活用

重い計算は、Computed Signalsでメモ化します。

```typescript
// ✅ 推奨: Computed Signalでメモ化
const expensiveResult = computed(() => {
  return heavyCalculation(data());
});

// ❌ 非推奨: メソッドで毎回計算
getExpensiveResult() {
  return heavyCalculation(this.data());
}
```

## テスト

### Signalsのテスト

```typescript
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

describe('ExampleComponent', () => {
  it('should update signal value', () => {
    const fixture = TestBed.createComponent(ExampleComponent);
    const component = fixture.componentInstance;
    
    // Signalの初期値を確認
    expect(component.count()).toBe(0);
    
    // Signalを更新
    component.count.set(5);
    
    // 更新後の値を確認
    expect(component.count()).toBe(5);
  });
  
  it('should compute derived value', () => {
    const fixture = TestBed.createComponent(ExampleComponent);
    const component = fixture.componentInstance;
    
    component.count.set(10);
    
    // Computed Signalの値を確認
    expect(component.doubleCount()).toBe(20);
  });
});
```

## 禁止事項

### ❌ Zone.jsの使用

```typescript
// ❌ 絶対に使用しない
import 'zone.js';
```

### ❌ 従来のプロパティベースの状態管理

```typescript
// ❌ 使用しない
export class OldComponent {
  count = 0;  // 通常のプロパティ
  
  increment() {
    this.count++;
  }
}

// ✅ Signalsを使用
export class NewComponent {
  count = signal(0);
  
  increment() {
    this.count.update(v => v + 1);
  }
}
```

### ❌ 古い制御フロー構文

```html
<!-- ❌ 使用しない -->
<div *ngIf="isVisible">Content</div>
<div *ngFor="let item of items">{{ item }}</div>

<!-- ✅ 新しい構文を使用 -->
@if (isVisible()) {
  <div>Content</div>
}
@for (item of items(); track item.id) {
  <div>{{ item }}</div>
}
```

## まとめ

- **Zoneless**: Zone.jsを使用せず、明示的な変更検知
- **Signals**: 状態管理の主要な手法
- **新しい構文**: `@if`, `@for`, `@switch`を使用
- **パフォーマンス**: Computed Signalsとtrackを活用
- **型安全性**: TypeScriptの型を最大限活用

このガイドラインに従うことで、高速で保守性の高いAngularアプリケーションを構築できます。
