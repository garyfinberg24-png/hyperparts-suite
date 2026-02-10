import type { IHyperStyleWebPartProps } from "../models";

export interface IHyperStyleProps extends IHyperStyleWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onWizardApply?: (result: Partial<IHyperStyleWebPartProps>) => void;
}
