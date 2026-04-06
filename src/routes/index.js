const fs = require('fs');
const path = require('path');

// const authRoutes = require("../modules/auth/auth.router");
// const jobRoutes = require("../modules/jobs/job.router");
//
// const routes = (app) => {
//     app.use('/api/v1/auth', authRoutes );
//     app.use('/api/v1/jobs', jobRoutes );
// }
//
// module.exports = routes;


function loadRoutes(app) {
  const modulesPath = path.join(__dirname, '../modules');

  const modules = fs.readdirSync(modulesPath);

  modules.forEach((moduleName) => {
    const modulePath = path.join(modulesPath, moduleName);

    // check if it's a folder
    if (fs.lstatSync(modulePath).isDirectory()) {
      const files = fs.readdirSync(modulePath);

      files.forEach((file) => {
        if (file.endsWith('.router.js')) {
          const routePath = path.join(modulePath, file);

          const router = require(routePath);

          // create route name from folder
          const routeName = moduleName;

          app.use(`/api/v1/${routeName}`, router);

          console.log(`✅ Loaded route: /api/v1/${routeName}`);
        }
      });
    }
  });
}

module.exports = loadRoutes;
