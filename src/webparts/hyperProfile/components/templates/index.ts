import type { TemplateType } from "../../models/IHyperProfileTemplate";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";

/* Re-export shared interface */
export type { IProfileTemplateProps } from "./IProfileTemplateProps";

/* Import all 15 templates */
import ProfileExecutive from "./ProfileExecutive";
import ProfileStandard from "./ProfileStandard";
import ProfileCompact from "./ProfileCompact";
import ProfileCorporate from "./ProfileCorporate";
import ProfileSocial from "./ProfileSocial";
import ProfileBento from "./ProfileBento";
import ProfileGlass from "./ProfileGlass";
import ProfileHero from "./ProfileHero";
import ProfileSidebar from "./ProfileSidebar";
import ProfileNeon from "./ProfileNeon";
import ProfileGradient from "./ProfileGradient";
import ProfileMagazine from "./ProfileMagazine";
import ProfileFlipCard from "./ProfileFlipCard";
import ProfileMinimal from "./ProfileMinimal";
import ProfileMosaic from "./ProfileMosaic";

/** Map of template ID → component */
const TEMPLATE_MAP: Record<string, React.FC<IProfileTemplateProps>> = {
  executive: ProfileExecutive,
  standard: ProfileStandard,
  compact: ProfileCompact,
  corporate: ProfileCorporate,
  social: ProfileSocial,
  bento: ProfileBento,
  glass: ProfileGlass,
  hero: ProfileHero,
  sidebar: ProfileSidebar,
  neon: ProfileNeon,
  gradient: ProfileGradient,
  magazine: ProfileMagazine,
  flipCard: ProfileFlipCard,
  minimal: ProfileMinimal,
  mosaic: ProfileMosaic,
};

/** Get the template component for a given template ID. Falls back to ProfileStandard. */
export function getTemplateComponent(templateId: TemplateType): React.FC<IProfileTemplateProps> {
  return TEMPLATE_MAP[templateId] || ProfileStandard;
}
