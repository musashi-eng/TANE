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
}
