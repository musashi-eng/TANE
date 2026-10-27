import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  PanelComponent,
  CardComponent,
  BadgeComponent,
  TableComponent,
  TableColumnDirective,
} from '@musashi-eng/design-system';

/** デモ用テーブル行の型 */
interface DemoRow {
  id: number;
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-data-page',
  imports: [
    PanelComponent,
    CardComponent,
    BadgeComponent,
    TableComponent,
    TableColumnDirective,
  ],
  templateUrl: './data-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPage {
  readonly tableData = signal<DemoRow[]>([
    { id: 1, name: '鳳条 ひより', role: '管理人', status: 'active' },
    { id: 2, name: '武蔵 太郎', role: '開発', status: 'active' },
    { id: 3, name: '武蔵 花子', role: 'デザイン', status: 'inactive' },
  ]);
}
