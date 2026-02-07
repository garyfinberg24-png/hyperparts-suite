/**
 * HyperPermissions — Permission checking utility (stub).
 * Will be implemented to check user permissions against SharePoint
 * site/list permissions and Azure AD group memberships.
 */

import { WebPartContext } from "@microsoft/sp-webpart-base";

export enum PermissionLevel {
  Read = "read",
  Contribute = "contribute",
  Edit = "edit",
  FullControl = "fullControl",
}

class HyperPermissionsService {
  private context: WebPartContext | null = null;

  initialize(ctx: WebPartContext): void {
    this.context = ctx;
  }

  async currentUserHasPermission(permissionLevel: PermissionLevel): Promise<boolean> {
    if (!this.context) {
      throw new Error("HyperPermissions not initialized.");
    }

    // Stub: will check against SP permissions via PnPjs
    console.debug("[HyperPermissions] Checking permission:", permissionLevel);
    return true;
  }

  async isUserInGroup(groupName: string): Promise<boolean> {
    if (!this.context) {
      throw new Error("HyperPermissions not initialized.");
    }

    // Stub: will check Azure AD group membership via Graph API
    console.debug("[HyperPermissions] Checking group membership:", groupName);
    return false;
  }

  async isUserInAnyGroup(groupNames: string[]): Promise<boolean> {
    const results = await Promise.all(groupNames.map(g => this.isUserInGroup(g)));
    return results.some(r => r);
  }

  getCurrentUserId(): number {
    if (!this.context) {
      throw new Error("HyperPermissions not initialized.");
    }
    return this.context.pageContext.legacyPageContext?.userId ?? 0;
  }

  getCurrentUserLoginName(): string {
    if (!this.context) {
      throw new Error("HyperPermissions not initialized.");
    }
    return this.context.pageContext.user.loginName;
  }
}

export const hyperPermissions = new HyperPermissionsService();
