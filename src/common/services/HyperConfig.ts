export interface HyperWebPartConfig {
  version: string;
  webPartId: string;
  properties: Record<string, unknown>;
  exportedAt: string;
}

export const exportConfig = (webPartId: string, props: Record<string, unknown>): string => {
  const config: HyperWebPartConfig = {
    version: "2.0",
    webPartId,
    properties: props,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(config, null, 2);
};

export const importConfig = (json: string): HyperWebPartConfig => {
  const config = JSON.parse(json) as HyperWebPartConfig;
  if (!config.version || !config.webPartId) {
    throw new Error("Invalid HyperParts configuration file.");
  }
  return config;
};
