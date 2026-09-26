const fs = require('fs');
const path = require('path');

const routerPath = path.join(__dirname, 'src/app/router/index.jsx');
let routerContent = fs.readFileSync(routerPath, 'utf8');

const newRouteBlock = `      <Route
        path={ROUTES.USER}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <AppShellLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route
          index
          element={<Navigate to={ROUTES.USER_DASHBOARD} replace />}
        />
        {memberRoutes}
      </Route>

      <Route`;

routerContent = routerContent.replace('{memberRoutes}', '');
routerContent = routerContent.replace('      <Route', newRouteBlock);

fs.writeFileSync(routerPath, routerContent);
console.log('Router updated.');
