import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

// テスト用のシンプルなコンポーネント
@Component({
  selector: 'app-test-nz',
  standalone: true,
  imports: [NzButtonModule],
  template: `
    <button nz-button nzType="primary">テストボタン</button>
  `
})
class TestNzComponent {}

describe('ng-zorro-antd テスト', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestNzComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create component with nz-button', () => {
    const fixture = TestBed.createComponent(TestNzComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render nz-button', () => {
    const fixture = TestBed.createComponent(TestNzComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('テストボタン');
  });
});
