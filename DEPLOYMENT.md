# HyperParts Suite — Deployment Guide

## Overview

This guide covers building, packaging, and deploying the HyperParts Suite `.sppkg` to SharePoint Online via Azure DevOps CI/CD or manual local deployment.

---

## 1. Azure AD App Registration (one-time setup)

The CI/CD pipeline uses certificate-based authentication to deploy to your App Catalog without interactive login.

### Step-by-step

1. **Go to** Azure Portal > Azure Active Directory > App Registrations > New Registration
2. **Name**: `HyperParts-Deploy-CI`
3. **Supported account types**: Single tenant
4. **Register**

### Add API Permissions

| API | Permission | Type |
|---|---|---|
| SharePoint | `Sites.FullControl.All` | Application |

Click **Grant admin consent** after adding.

### Create a Certificate

```bash
# Generate a self-signed certificate (valid 2 years)
openssl req -x509 -newkey rsa:2048 -keyout hyperparts-deploy.key -out hyperparts-deploy.crt -days 730 -nodes -subj "/CN=HyperParts-Deploy-CI"

# Create PFX bundle (for pipeline)
openssl pkcs12 -export -out hyperparts-deploy.pfx -inkey hyperparts-deploy.key -in hyperparts-deploy.crt -passout pass:

# Base64-encode the PFX (this value goes into ADO variable group)
base64 -w 0 hyperparts-deploy.pfx > hyperparts-deploy.pfx.b64
```

### Upload Certificate to App Registration

1. Go to **Certificates & secrets** > **Certificates** tab
2. Upload `hyperparts-deploy.crt`

---

## 2. Azure DevOps Variable Group

Create a Variable Group named **`HyperParts-Deploy`** in your ADO project:

| Variable | Value | Secret? |
|---|---|---|
| `TENANT_ID` | Your Azure AD tenant ID (GUID) | No |
| `APP_ID` | The App Registration client ID | No |
| `CERTIFICATE_BASE64` | Contents of `hyperparts-deploy.pfx.b64` | **Yes** |
| `APP_CATALOG_URL` | `https://mf7m.sharepoint.com/sites/appcatalog` | No |

> **Tenant**: `mf7m.sharepoint.com`
> **Target site**: `https://mf7m.sharepoint.com/sites/appcatalog`

### To create

1. ADO > Project Settings > Pipelines > Library
2. **+ Variable group** > Name: `HyperParts-Deploy`
3. Add the 4 variables above
4. Mark `CERTIFICATE_BASE64` as secret (lock icon)
5. Save

---

## 3. Tenant App Catalog (one-time verification)

Deployment targets the **tenant App Catalog** at `https://mf7m.sharepoint.com/sites/appcatalog`. This makes web parts available to all sites in the tenant, including `https://mf7m.sharepoint.com/sites/HyperSite`.

### Verify the App Catalog exists

```bash
m365 login
m365 spo tenant appcatalog list
```

If no tenant App Catalog exists, a SharePoint Admin can create one:

1. Go to **SharePoint Admin Center** (`https://mf7m-admin.sharepoint.com`)
2. **More Features** > **Apps** > **Open**
3. Follow the prompt to create the App Catalog site (defaults to `/sites/appcatalog`)

### Add web parts to HyperSite after deployment

Once deployed to the tenant App Catalog, go to `https://mf7m.sharepoint.com/sites/HyperSite`:

1. Site Settings > **Site Contents** > **New** > **App**
2. Find "hyperparts-suite" and click **Add**
3. Web parts are now available in the page editor for HyperSite

> With `skipFeatureDeployment: true` (already set in `package-solution.json`), the web parts are automatically available on all sites without needing to manually add the app per-site.

---

## 4. Pipeline Setup

1. Go to **Pipelines** > **New Pipeline**
2. Select **Azure Repos Git** (or your source)
3. Select the repository
4. Choose **Existing Azure Pipelines YAML file**
5. Path: `/hyperparts-suite/azure-pipelines.yml`
6. Save and run

### Pipeline behavior

| Trigger | Stage |
|---|---|
| Push to `main` | Build + Deploy |
| Push to `develop` | Build only |
| PR to `main` | Build only (validation) |

### Environment approval

The Deploy stage targets the `SharePoint-Production` environment. To add approval gates:

1. ADO > Pipelines > Environments > `SharePoint-Production`
2. Click the kebab menu > **Approvals and checks**
3. Add **Approvals** > select approvers

---

## 5. Local Deployment (manual)

For quick local builds and deploys without CI/CD:

### Prerequisites

```bash
# Install CLI for Microsoft 365
npm install -g @pnp/cli-microsoft365

# Login (interactive — browser popup)
m365 login
```

### Using the script

```powershell
# Full build + deploy
.\scripts\deploy-local.ps1 -AppCatalogUrl "https://mf7m.sharepoint.com/sites/appcatalog"

# Deploy existing .sppkg (skip build)
.\scripts\deploy-local.ps1 -AppCatalogUrl "https://..." -SkipBuild

# Build + upload only (don't make available to sites)
.\scripts\deploy-local.ps1 -AppCatalogUrl "https://..." -SkipDeploy
```

### Manual commands (no script)

```bash
cd hyperparts-suite

# Build
npx gulp bundle --ship
npx gulp package-solution --ship

# Upload & deploy
m365 spo app add --filePath sharepoint/solution/hyperparts-suite.sppkg --appCatalogUrl https://mf7m.sharepoint.com/sites/appcatalog --overwrite
m365 spo app deploy --name hyperparts-suite.sppkg --appCatalogUrl https://mf7m.sharepoint.com/sites/appcatalog --skipFeatureDeployment
```

---

## 6. Post-Deployment — API Permissions

After the first deployment, a SharePoint Admin must approve API permissions:

1. Go to **SharePoint Admin Center** > **Advanced** > **API Access**
2. You'll see pending requests for:
   - `User.Read.All`
   - `User.ReadBasic.All`
   - `Presence.Read.All`
   - `Calendars.Read` / `Calendars.ReadWrite`
   - `Group.Read.All`
   - `Sites.Read.All`
   - `Mail.Send`
   - `Chat.ReadWrite`
   - `Files.Read.All`
   - `People.Read`
3. **Approve** each one

> These only need to be approved once. Subsequent deployments reuse the same permissions.

---

## 7. Versioning

Update the version in `config/package-solution.json` before shipping:

```json
"version": "1.0.0.0"
```

SPFx uses 4-part version: `major.minor.patch.revision`. Increment appropriately:

| Change | Example |
|---|---|
| New web parts added | `1.1.0.0` |
| Bug fixes | `1.0.1.0` |
| Breaking changes | `2.0.0.0` |

---

## 8. Troubleshooting

| Issue | Solution |
|---|---|
| `gulp bundle --ship` fails with lint errors | Linting is disabled in `gulpfile.js` — check for TS errors |
| `.sppkg` not found after build | Ensure `sharepoint/solution/` directory exists after `package-solution` |
| M365 CLI login fails in pipeline | Verify `CERTIFICATE_BASE64` is correct and cert is uploaded to App Registration |
| "Access denied" on deploy | App Registration needs `Sites.FullControl.All` with admin consent |
| API permissions not appearing | They show up after first deployment of the `.sppkg` to the App Catalog |
| Web parts not visible on pages | Ensure `skipFeatureDeployment: true` in `package-solution.json` and app is deployed (not just uploaded) |
