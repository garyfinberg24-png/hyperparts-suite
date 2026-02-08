import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as graphSPFx } from "@pnp/graph";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/site-users";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/search";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/photos";
import "@pnp/graph/teams";
import "@pnp/graph/calendars";

let _sp: SPFI | undefined;
let _graph: GraphFI | undefined;
let _context: WebPartContext | undefined;

export const initHyperPnP = (ctx: WebPartContext): void => {
  _context = ctx;
  _sp = spfi().using(spSPFx(ctx)).using(PnPLogging(LogLevel.Warning));
  _graph = graphfi().using(graphSPFx(ctx));
};

export const getSP = (): SPFI => {
  if (!_sp) throw new Error("HyperPnP not initialized. Call initHyperPnP(context) first.");
  return _sp;
};

export const getGraph = (): GraphFI => {
  if (!_graph) throw new Error("HyperPnP not initialized. Call initHyperPnP(context) first.");
  return _graph;
};

export const getContext = (): WebPartContext => {
  if (!_context) throw new Error("HyperPnP not initialized.");
  return _context;
};
