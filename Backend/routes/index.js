import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import log from '../common/utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadRoutes = async (app) => {
  const modulesPath = path.join(__dirname, '../modules');

  let modules;
  try {
    modules = await fs.readdir(modulesPath);
  } catch {
    console.warn(`⚠ No modules directory found at ${modulesPath}`);
    log.warn(`⚠ No modules directory found at ${modulesPath}`);
    return;
  }

  console.log(`📦 Found modules: ${modules.join(', ')}`);
  log.info(`Found modules: ${modules.join(', ')}`);

  for (const moduleName of modules) {
    const apiPath = path.join(modulesPath, moduleName, 'api');

    try {
      const files = await fs.readdir(apiPath);

      for (const file of files) {
        if (file.endsWith('Routes.js')) {
          const filePath = path.join(apiPath, file);
          const fileUrl = pathToFileURL(filePath).href;

          const routeModule = await import(fileUrl);
          const routeBase =
            routeModule.basePath || `/${moduleName.toLowerCase()}`;

          console.log(`✅ Loaded route: ${routeBase} -> ${file}`);
          log.info(`Loaded route: ${routeBase} -> ${file}`);
          app.use(routeBase, routeModule.default);
        }
      }
    } catch {
      // api folder might not exist, skip silently
      continue;
    }
  }
};
