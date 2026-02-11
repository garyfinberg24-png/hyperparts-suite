import type { ILertAlert } from "../../models/ILertAlert";
import type { ILertKpiCard } from "../../models/ILertKpi";

export interface ILertLayoutProps {
  alerts: ILertAlert[];
  kpiCards: ILertKpiCard[];
  showKpi: boolean;
  onAlertClick: (alertId: string) => void;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onSnooze: (alertId: string, minutes: number) => void;
  selectedAlertId: string;
}
