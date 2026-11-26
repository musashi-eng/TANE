import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  PanelComponent,
  CardComponent,
  BadgeComponent,
  TableComponent,
  TableColumnDirective,
  GroupTableComponent,
  GroupTableColumnDirective,
  type CellEditEvent,
} from '@musashi-eng/design-system';

/** グループ表デモの行の型 */
interface SalesRow {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
}

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
    GroupTableComponent,
    GroupTableColumnDirective,
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

  /** グループ表デモデータ（得意先ごとにグループ化。返品で負数の行を含む） */
  readonly salesData = signal<SalesRow[]>([
    { id: 's1', customer: '東京商事', product: 'りんご', quantity: 120, amount: 36000 },
    { id: 's2', customer: '東京商事', product: 'みかん', quantity: 80, amount: 20000 },
    { id: 's3', customer: '東京商事', product: 'りんご（返品）', quantity: -10, amount: -3000 },
    { id: 's4', customer: '大阪物産', product: 'ぶどう', quantity: 50, amount: 45000 },
    { id: 's5', customer: '大阪物産', product: 'もも', quantity: 30, amount: 27000 },
    { id: 's6', customer: '名古屋商店', product: 'なし', quantity: 60, amount: 24000 },
  ]);

  /** グループ表の選択行 */
  readonly salesSelected = signal<Set<string>>(new Set());

  /** グループ表の閉じているグループ */
  readonly salesCollapsed = signal<Set<string>>(new Set());

  /** 行チェックの読み上げ用ラベル */
  readonly salesRowLabel = (row: SalesRow): string => `${row.customer} ${row.product}`;

  /** 金額セルの編集確定を反映する */
  onSalesEdited(event: CellEditEvent<SalesRow>): void {
    this.salesData.update((rows) =>
      rows.map((r) => (r.id === event.rowKey ? { ...r, [event.column]: event.value } : r)),
    );
  }
}
