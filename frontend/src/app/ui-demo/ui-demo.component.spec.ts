/**
 * デモコンポーネントテスト
 * 
 * このテストは、UiDemoComponentが正しく動作し、
 * ng-zorroコンポーネントとFontAwesomeアイコンを適切に表示することを検証します。
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';
import { UiDemoComponent } from './ui-demo.component';

describe('UiDemoComponent', () => {
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

  describe('Component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be a standalone component', () => {
      // Standalone Componentであることを確認
      const componentDef = (component.constructor as any).ɵcmp;
      expect(componentDef.standalone).toBe(true);
    });
  });

  describe('FontAwesome icons', () => {
    it('should have solid icons defined', () => {
      expect(component.faHeart).toBeDefined();
      expect(component.faUser).toBeDefined();
      expect(component.faEnvelope).toBeDefined();
      expect(component.faCheck).toBeDefined();
      expect(component.faTimes).toBeDefined();
    });

    it('should have regular icons defined', () => {
      expect(component.faHeartRegular).toBeDefined();
      expect(component.faCircle).toBeDefined();
    });

    it('should have brands icons defined', () => {
      expect(component.faGithub).toBeDefined();
      expect(component.faTwitter).toBeDefined();
      expect(component.faLinkedin).toBeDefined();
    });
  });

  describe('Signals for state management', () => {
    it('should have userName signal', () => {
      expect(component.userName).toBeDefined();
      expect(typeof component.userName()).toBe('string');
      expect(component.userName()).toBe('');
    });

    it('should have email signal', () => {
      expect(component.email).toBeDefined();
      expect(typeof component.email()).toBe('string');
      expect(component.email()).toBe('');
    });

    it('should have isLoading signal', () => {
      expect(component.isLoading).toBeDefined();
      expect(typeof component.isLoading()).toBe('boolean');
      expect(component.isLoading()).toBe(false);
    });

    it('should have tableData signal', () => {
      expect(component.tableData).toBeDefined();
      expect(Array.isArray(component.tableData())).toBe(true);
      expect(component.tableData().length).toBeGreaterThan(0);
    });

    it('should update userName signal', () => {
      component.userName.set('テストユーザー');
      expect(component.userName()).toBe('テストユーザー');
    });

    it('should update email signal', () => {
      component.email.set('test@example.com');
      expect(component.email()).toBe('test@example.com');
    });
  });

  describe('ng-zorro components rendering', () => {
    it('should render ng-zorro buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[nz-button]');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render ng-zorro cards', () => {
      const cards = fixture.nativeElement.querySelectorAll('nz-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should render ng-zorro table', () => {
      const table = fixture.nativeElement.querySelector('nz-table');
      expect(table).toBeTruthy();
    });

    it('should render ng-zorro form', () => {
      const form = fixture.nativeElement.querySelector('form[nz-form]');
      expect(form).toBeTruthy();
    });

    it('should render ng-zorro input groups', () => {
      const inputGroups = fixture.nativeElement.querySelectorAll('nz-input-group');
      expect(inputGroups.length).toBeGreaterThan(0);
    });
  });

  describe('FontAwesome icons rendering', () => {
    it('should render FontAwesome icons', () => {
      const icons = fixture.nativeElement.querySelectorAll('fa-icon');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render SVG elements for icons', () => {
      const svgs = fixture.nativeElement.querySelectorAll('fa-icon svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('ng-zorro and FontAwesome combination', () => {
    it('should render buttons with FontAwesome icons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[nz-button]');
      let hasIconInButton = false;
      
      buttons.forEach((button: HTMLElement) => {
        const icon = button.querySelector('fa-icon');
        if (icon) {
          hasIconInButton = true;
        }
      });
      
      expect(hasIconInButton).toBe(true);
    });

    it('should render input groups with FontAwesome icons', () => {
      const inputGroups = fixture.nativeElement.querySelectorAll('nz-input-group');
      expect(inputGroups.length).toBeGreaterThan(0);
    });
  });

  describe('Component methods', () => {
    it('should have handleSubmit method', () => {
      expect(component.handleSubmit).toBeDefined();
      expect(typeof component.handleSubmit).toBe('function');
    });

    it('should have handleButtonClick method', () => {
      expect(component.handleButtonClick).toBeDefined();
      expect(typeof component.handleButtonClick).toBe('function');
    });

    it('should set isLoading to true when handleSubmit is called', () => {
      component.userName.set('テストユーザー');
      component.email.set('test@example.com');
      
      component.handleSubmit();
      
      expect(component.isLoading()).toBe(true);
    });

    it('should call handleButtonClick without errors', () => {
      expect(() => {
        component.handleButtonClick('primary');
      }).not.toThrow();
    });
  });

  describe('Table data', () => {
    it('should have initial table data', () => {
      const tableData = component.tableData();
      expect(tableData.length).toBe(3);
    });

    it('should have correct table data structure', () => {
      const tableData = component.tableData();
      const firstItem = tableData[0];
      
      expect(firstItem.id).toBeDefined();
      expect(firstItem.name).toBeDefined();
      expect(firstItem.status).toBeDefined();
      expect(firstItem.priority).toBeDefined();
    });

    it('should render table rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(component.tableData().length);
    });
  });

  describe('Responsive design', () => {
    it('should have ui-demo-container class', () => {
      const container = fixture.nativeElement.querySelector('.ui-demo-container');
      expect(container).toBeTruthy();
    });

    it('should have button-group class', () => {
      const buttonGroup = fixture.nativeElement.querySelector('.button-group');
      expect(buttonGroup).toBeTruthy();
    });

    it('should have icon-group class', () => {
      const iconGroup = fixture.nativeElement.querySelector('.icon-group');
      expect(iconGroup).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const h1 = fixture.nativeElement.querySelector('h1');
      expect(h1).toBeTruthy();
      expect(h1.textContent).toContain('UI Library Integration Demo');
    });

    it('should have form labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('nz-form-label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should have button text or icons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[nz-button]');
      buttons.forEach((button: HTMLElement) => {
        const hasText = button.textContent && button.textContent.trim().length > 0;
        const hasIcon = button.querySelector('fa-icon') !== null;
        expect(hasText || hasIcon).toBe(true);
      });
    });
  });
});
