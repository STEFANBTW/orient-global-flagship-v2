# PNPM Workspace Guide: Sorikyo-warehouse

Welcome to your shared workspace! This directory is set up as a **PNPM Workspace**. This configuration is designed to save significant SSD storage space on your laptop while enabling you to work on multiple projects simultaneously.

---

## Why PNPM? (The Space-Saving Solution)

Unlike standard `npm` or `yarn` which copy package files (like `react`, `leaflet`, etc.) separately into the `node_modules` of *every single project*, **pnpm** uses a **Content-Addressable Store**.
* **Hard Links**: All dependencies are stored in a single global cache on your drive. When you install packages in a project, pnpm creates "hard links" to the global cache.
* **Storage Savings**: If you build 10 React apps, the files for `react` and `react-dom` are stored **only once** on your SSD instead of 10 times. This is essential for laptops with limited SSD storage (like your 256GB drive).

---

## Workspace Structure

Your repository is set up with a `pnpm-workspace.yaml` file:
```yaml
packages:
  - '*'
```
This means any subfolder inside `Sorikyo-warehouse` (like `UJ3DMap`) is automatically registered as a package in the workspace and can share dependencies seamlessly.

---

## Common PNPM Commands

Here is how to run commands in this workspace.

### 1. Running Commands inside a Specific Project (Recommended)
You can navigate into any project folder (e.g., `UJ3DMap`) and run commands normally:
* **Install dependencies**: `pnpm install`
* **Add a package**: `pnpm add <package-name>`
* **Add a dev package**: `pnpm add -D <package-name>`
* **Run a script**: `pnpm dev` or `pnpm build`

### 2. Running Commands from the Root Folder
If you are in the root `Sorikyo-warehouse` directory, you can run commands for specific projects without changing directories by using the `--filter` flag:
* **Start Dev Server for UJ3DMap**: 
  ```powershell
  pnpm --filter UJ3DMap dev
  ```
* **Build UJ3DMap**: 
  ```powershell
  pnpm --filter UJ3DMap build
  ```
* **Add a dependency to UJ3DMap**: 
  ```powershell
  pnpm --filter UJ3DMap add leaflet
  ```

### 3. Adding Workspace-wide Dependencies (Root)
If you want to install a package that you can run from the root of the workspace (e.g. testing utilities or linting configs):
```powershell
pnpm add -w -D <package-name>
```

---

## Windows Troubleshooting

### PowerShell Script Execution Policy
On Windows, PowerShell might block running scripts (like `pnpm dev` or `npm run dev`) with an error like:
* *"File ... cannot be loaded because running scripts is disabled on this system"*

To bypass this for your current command session, run this command in PowerShell before starting:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```
Alternatively, you can change the machine policy once globally (requires running PowerShell as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
