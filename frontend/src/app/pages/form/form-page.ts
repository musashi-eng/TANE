import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PanelComponent,
  InputComponent,
  TextareaComponent,
  SelectComponent,
  type SelectOption,
  CheckboxComponent,
  SwitchComponent,
  DatePickerComponent,
  MultiSelectComponent,
  type MultiSelectOption,
  MonthPickerComponent,
  DateRangePickerComponent,
  MonthRangePickerComponent,
  FileDropComponent,
  type DateRange,
  FormFieldComponent,
  ReadonlyFieldComponent,
} from '@musashi-eng/design-system';

@Component({
  selector: 'app-form-page',
  imports: [
    FormsModule,
    PanelComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxComponent,
    SwitchComponent,
    DatePickerComponent,
    MultiSelectComponent,
    MonthPickerComponent,
    DateRangePickerComponent,
    MonthRangePickerComponent,
    FileDropComponent,
    FormFieldComponent,
    ReadonlyFieldComponent,
  ],
  templateUrl: './form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPage {
  readonly inputValue = signal('');
  readonly textareaValue = signal('');
  readonly selectValue = signal('');
  readonly dateValue = signal('');
  readonly agreeChecked = signal(false);
  readonly notifyEnabled = signal(true);

  readonly selectOptions: SelectOption[] = [
    { value: 'dev', label: '開発' },
    { value: 'design', label: 'デザイン' },
    { value: 'pm', label: 'プロジェクト管理' },
  ];

  /** 複数選択の選択値 */
  readonly multiValues = signal<string[]>(['A001', 'A003']);
  /** 複数選択の選択肢（検索キーに code / kana を使う） */
  readonly multiOptions: MultiSelectOption[] = [
    { value: 'A001', label: '東京商事', code: 'A001', kana: 'トウキョウショウジ' },
    { value: 'A002', label: '大阪物産', code: 'A002', kana: 'オオサカブッサン' },
    { value: 'A003', label: '名古屋商店', code: 'A003', kana: 'ナゴヤショウテン' },
    { value: 'A004', label: '札幌フーズ', code: 'A004', kana: 'サッポロフーズ' },
    { value: 'A005', label: '福岡産業', code: 'A005', kana: 'フクオカサンギョウ' },
    { value: 'A006', label: '仙台トレード', code: 'A006', kana: 'センダイトレード' },
  ];
  readonly multiSearchKeys = ['label', 'code', 'kana'];

  /** 月選択（yyyy-MM） */
  readonly monthValue = signal('2026-11');
  /** 期間選択 */
  readonly dateRange = signal<DateRange>({ start: '2026-11-01', end: '2026-11-30' });
  /** 月の期間選択 */
  readonly monthRange = signal<DateRange>({ start: '2026-04', end: '2026-09' });

  /** ファイルドロップ: 受理したファイル名 */
  readonly acceptedFiles = signal<string[]>([]);
  /** ファイルドロップ: 拒否したファイル名 */
  readonly rejectedFiles = signal<string[]>([]);

  /** 受理ファイルを保持する */
  onFilesSelected(files: File[]): void {
    this.rejectedFiles.set([]);
    this.acceptedFiles.set(files.map((f) => f.name));
  }

  /** 拒否ファイルを保持する */
  onFilesRejected(files: File[]): void {
    this.rejectedFiles.set(files.map((f) => f.name));
  }
}
