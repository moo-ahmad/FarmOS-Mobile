export type StockStatus = 'low' | 'ok';

export interface StockItem {
  id: string;
  name: string;
  status: StockStatus;
  /** e.g. "2 bags on hand" / "1.2 L on hand · exp Nov 26". */
  onHandLabel: string;
  /** e.g. "reorder at 5" / "reorder at 2 L". */
  reorderLabel: string;
  /** 0–1, how full the level bar renders. */
  fillFraction: number;
  /** 0–1 reorder-threshold marker; only shown on low-stock items. */
  thresholdFraction?: number;
}
