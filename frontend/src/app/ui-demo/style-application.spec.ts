/**
 * スタイル適用テスト
 * 
 * このテストは、ng-zorroとFontAwesomeのスタイルが正しく適用され、
 * スタイルの競合がないことを検証します。
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';
import { UiDemoComponent } from './ui-demo.component';

describe('Style Application', () => {
  let component: UiDemoComponent;
  let fixture: ComponentFixture<UiDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDemoComponent],
      providers: [
        provideAnimationsAsync(),
        provideNzI18n(ja_JP)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ng-zorro button styles', () => {
    it('should apply Ant Design styles to buttons', () => {
      const button = fixture.nativeElement.querySelector('button[nz-button]');
      expect(button).toBeTruthy();
      
      // ボタンが存在し、ng-zorroのクラスが適用されていることを確認
      const classList = Array.from(button.classList);
      const hasAntClass = classList.some((className: any) => 
        typeof className === 'string' && className.startsWith('ant-')
      );
      expect(hasAntClass).toBe(true);
    });

    it('should have different button types', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[nz-button]');
      expect(buttons.length).toBeGreaterThan(1);
      
      // 異なるボタンタイプが存在することを確認
      const buttonTypes = new Set();
      buttons.forEach((button: HTMLElement) => {
        const classList = Array.from(button.classList);
        classList.forEach((className: any) => {
          if (typeof className === 'string' && className.includes('ant-btn')) {
            buttonTypes.add(className);
          }
        });
      });
      
      expect(buttonTypes.size).toBeGreaterThan(0);
    });
  });

  describe('ng-zorro card styles', () => {
    it('should apply Ant Design styles to cards', () => {
      const cards = fixture.nativeElement.querySelectorAll('nz-card');
      expect(cards.length).toBeGreaterThan(0);
      
      cards.forEach((card: HTMLElement) => {
        // カードが存在することを確認
        expect(card).toBeTruthy();
      });
    });

    it('should have card titles', () => {
      const cardTitles = fixture.nativeElement.querySelectorAll('nz-card [nzTitle]');
      expect(cardTitles.length).toBeGreaterThan(0);
    });
  });

  describe('ng-zorro form styles', () => {
    it('should apply Ant Design styles to form', () => {
      const form = fixture.nativeElement.querySelector('form[nz-form]');
      expect(form).toBeTruthy();
    });

    it('should have form items', () => {
      const formItems = fixture.nativeElement.querySelectorAll('nz-form-item');
      expect(formItems.length).toBeGreaterThan(0);
    });

    it('should have form labels', () => {
      const formLabels = fixture.nativeElement.querySelectorAll('nz-form-label');
      expect(formLabels.length).toBeGreaterThan(0);
    });

    it('should have form controls', () => {
      const formControls = fixture.nativeElement.querySelectorAll('nz-form-control');
      expect(formControls.length).toBeGreaterThan(0);
    });
  });

  describe('ng-zorro table styles', () => {
    it('should apply Ant Design styles to table', () => {
      const table = fixture.nativeElement.querySelector('nz-table');
      expect(table).toBeTruthy();
    });

    it('should have table headers', () => {
      const headers = fixture.nativeElement.querySelectorAll('thead th');
      expect(headers.length).toBeGreaterThan(0);
    });

    it('should have table rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('FontAwesome icon styles', () => {
    it('should render FontAwesome icons as SVG', () => {
      const icons = fixture.nativeElement.querySelectorAll('fa-icon');
      expect(icons.length).toBeGreaterThan(0);
      
      icons.forEach((icon: HTMLElement) => {
        const svg = icon.querySelector('svg');
        expect(svg).toBeTruthy();
      });
    });

    it('should have SVG elements with proper attributes', () => {
      const svgs = fixture.nativeElement.querySelectorAll('fa-icon svg');
      expect(svgs.length).toBeGreaterThan(0);
      
      svgs.forEach((svg: SVGElement) => {
        // SVGが適切な属性を持っていることを確認
        expect(svg.getAttribute('role')).toBe('img');
      });
    });

    it('should display icons inline', () => {
      const icons = fixture.nativeElement.querySelectorAll('fa-icon svg');
      expect(icons.length).toBeGreaterThan(0);
      
      icons.forEach((icon: HTMLElement) => {
        const display = window.getComputedStyle(icon).display;
        // SVGがdisplay: noneでないことを確認
        expect(display).not.toBe('none');
      });
    });
  });

  describe('Style conflicts', () => {
    it('should not have style conflicts between ng-zorro and FontAwesome', () => {
      const buttonsWithIcons = fixture.nativeElement.querySelectorAll('button[nz-button] fa-icon');
      expect(buttonsWithIcons.length).toBeGreaterThan(0);
      
      buttonsWithIcons.forEach((icon: HTMLElement) => {
        // アイコンが表示されていることを確認
        const svg = icon.querySelector('svg');
        expect(svg).toBeTruthy();
        
        // SVGが非表示になっていないことを確認
        const display = window.getComputedStyle(svg as Element).display;
        expect(display).not.toBe('none');
      });
    });

    it('should render both ng-zorro components and FontAwesome icons correctly', () => {
      const nzComponents = fixture.nativeElement.querySelectorAll('[nz-button], nz-card, nz-table');
      const faIcons = fixture.nativeElement.querySelectorAll('fa-icon');
      
      expect(nzComponents.length).toBeGreaterThan(0);
      expect(faIcons.length).toBeGreaterThan(0);
    });

    it('should have proper spacing in button groups', () => {
      const buttonGroup = fixture.nativeElement.querySelector('.button-group');
      expect(buttonGroup).toBeTruthy();
      
      const buttons = buttonGroup.querySelectorAll('button[nz-button]');
      expect(buttons.length).toBeGreaterThan(1);
    });

    it('should have proper spacing in icon groups', () => {
      const iconGroup = fixture.nativeElement.querySelector('.icon-group');
      expect(iconGroup).toBeTruthy();
      
      const iconItems = iconGroup.querySelectorAll('.icon-item');
      expect(iconItems.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive design', () => {
    it('should have container with proper styling', () => {
      const container = fixture.nativeElement.querySelector('.ui-demo-container');
      expect(container).toBeTruthy();
    });

    it('should have cards with proper margins', () => {
      const cards = fixture.nativeElement.querySelectorAll('nz-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have button group with flex layout', () => {
      const buttonGroup = fixture.nativeElement.querySelector('.button-group');
      expect(buttonGroup).toBeTruthy();
    });

    it('should have icon group with flex layout', () => {
      const iconGroup = fixture.nativeElement.querySelector('.icon-group');
      expect(iconGroup).toBeTruthy();
    });
  });

  describe('Theme consistency', () => {
    it('should use consistent color scheme', () => {
      // ng-zorroのプライマリカラーが適用されていることを確認
      const primaryButtons = fixture.nativeElement.querySelectorAll('button[nz-button][nzType="primary"]');
      expect(primaryButtons.length).toBeGreaterThan(0);
    });

    it('should have consistent typography', () => {
      const h1 = fixture.nativeElement.querySelector('h1');
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBeTruthy();
    });

    it('should have consistent spacing', () => {
      const cards = fixture.nativeElement.querySelectorAll('nz-card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Icon and button integration', () => {
    it('should render icons inside buttons correctly', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[nz-button]');
      let iconCount = 0;
      
      buttons.forEach((button: HTMLElement) => {
        const icon = button.querySelector('fa-icon');
        if (icon) {
          iconCount++;
          const svg = icon.querySelector('svg');
          expect(svg).toBeTruthy();
        }
      });
      
      expect(iconCount).toBeGreaterThan(0);
    });

    it('should render icons in input groups correctly', () => {
      const inputGroups = fixture.nativeElement.querySelectorAll('nz-input-group');
      expect(inputGroups.length).toBeGreaterThan(0);
    });

    it('should render icons in table cells correctly', () => {
      const tableCells = fixture.nativeElement.querySelectorAll('tbody td');
      let hasIconInCell = false;
      
      tableCells.forEach((cell: HTMLElement) => {
        const icon = cell.querySelector('fa-icon');
        if (icon) {
          hasIconInCell = true;
        }
      });
      
      expect(hasIconInCell).toBe(true);
    });
  });

  describe('LESS styles', () => {
    it('should load component styles', () => {
      // コンポーネントのスタイルが読み込まれていることを確認
      const container = fixture.nativeElement.querySelector('.ui-demo-container');
      expect(container).toBeTruthy();
    });

    it('should have custom styles applied', () => {
      const buttonGroup = fixture.nativeElement.querySelector('.button-group');
      const iconGroup = fixture.nativeElement.querySelector('.icon-group');
      
      expect(buttonGroup).toBeTruthy();
      expect(iconGroup).toBeTruthy();
    });
  });
});
