import type { IHyperHeroSlide, IHyperHeroResponsiveLayouts, IHyperHeroRotation } from "../models";

/** A saved slider configuration stored in localStorage */
export interface IStoredSliderConfig {
  id: string;
  name: string;
  savedAt: string;
  slideCount: number;
  slides: IHyperHeroSlide[];
  layouts: IHyperHeroResponsiveLayouts;
  heroHeight?: number;
  borderRadius?: number;
  fullBleed?: boolean;
  rotation?: IHyperHeroRotation;
  sliderMode?: string;
}

var STORAGE_KEY = "hyperHero_sliderConfigs";

/** Retrieve all stored slider configs from localStorage */
export function getStoredSliders(): IStoredSliderConfig[] {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as IStoredSliderConfig[];
  } catch (_e) {
    return [];
  }
}

/** Write the full configs array back to localStorage */
function writeConfigs(configs: IStoredSliderConfig[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (_e) {
    // Storage full or unavailable — silently fail
  }
}

/** Save (upsert) a slider config by id */
export function saveSlider(config: IStoredSliderConfig): void {
  var configs = getStoredSliders();
  var found = false;
  var updated: IStoredSliderConfig[] = [];
  configs.forEach(function (c) {
    if (c.id === config.id) {
      updated.push(config);
      found = true;
    } else {
      updated.push(c);
    }
  });
  if (!found) {
    updated.push(config);
  }
  writeConfigs(updated);
}

/** Delete a stored slider config by id */
export function deleteSlider(id: string): void {
  var configs = getStoredSliders();
  var filtered = configs.filter(function (c) { return c.id !== id; });
  writeConfigs(filtered);
}

/** Rename a stored slider config */
export function renameSlider(id: string, name: string): void {
  var configs = getStoredSliders();
  var updated: IStoredSliderConfig[] = [];
  configs.forEach(function (c) {
    if (c.id === id) {
      updated.push({ ...c, name: name });
    } else {
      updated.push(c);
    }
  });
  writeConfigs(updated);
}

/** Duplicate a stored slider config, returning the new copy */
export function duplicateSlider(id: string): IStoredSliderConfig | undefined {
  var configs = getStoredSliders();
  var source: IStoredSliderConfig | undefined = undefined;
  configs.forEach(function (c) { if (c.id === id) source = c; });
  if (!source) return undefined;
  var found: IStoredSliderConfig = source as IStoredSliderConfig;
  var cloned: IStoredSliderConfig = {
    id: "slider-" + Date.now(),
    name: found.name + " (copy)",
    savedAt: new Date().toISOString(),
    slideCount: found.slideCount,
    slides: found.slides,
    layouts: found.layouts,
    heroHeight: found.heroHeight,
    borderRadius: found.borderRadius,
    fullBleed: found.fullBleed,
    rotation: found.rotation,
    sliderMode: found.sliderMode,
  };
  configs.push(cloned);
  writeConfigs(configs);
  return cloned;
}

/** Build a new IStoredSliderConfig from current web part state */
export function buildSliderConfig(
  name: string,
  slides: IHyperHeroSlide[],
  layouts: IHyperHeroResponsiveLayouts,
  settings: {
    heroHeight?: number;
    borderRadius?: number;
    fullBleed?: boolean;
    rotation?: IHyperHeroRotation;
    sliderMode?: string;
  }
): IStoredSliderConfig {
  return {
    id: "slider-" + Date.now(),
    name: name,
    savedAt: new Date().toISOString(),
    slideCount: slides.length,
    slides: slides,
    layouts: layouts,
    heroHeight: settings.heroHeight,
    borderRadius: settings.borderRadius,
    fullBleed: settings.fullBleed,
    rotation: settings.rotation,
    sliderMode: settings.sliderMode,
  };
}

/** Export a slider config as a JSON file download */
export function exportSliderToJson(config: IStoredSliderConfig): void {
  var json = JSON.stringify(config, undefined, 2);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = config.name.replace(/\s+/g, "-").toLowerCase() + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Import a slider config from a JSON file (returns a Promise) */
export function importSliderFromJson(): Promise<IStoredSliderConfig | undefined> {
  return new Promise(function (resolve) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = function () {
      var files = input.files;
      if (!files || files.length === 0) {
        resolve(undefined);
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var config = JSON.parse(reader.result as string) as IStoredSliderConfig;
          // Validate minimum shape
          if (config && config.slides && Array.isArray(config.slides)) {
            // Assign a fresh id if missing
            if (!config.id) {
              config.id = "slider-" + Date.now();
            }
            if (!config.name) {
              config.name = "Imported Slider";
            }
            config.savedAt = new Date().toISOString();
            config.slideCount = config.slides.length;
            resolve(config);
          } else {
            resolve(undefined);
          }
        } catch (_e) {
          resolve(undefined);
        }
      };
      reader.readAsText(files[0]);
    };
    // Handle cancel (no file selected)
    input.addEventListener("cancel", function () {
      resolve(undefined);
    });
    input.click();
  });
}
