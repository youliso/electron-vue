import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import Router from '@/renderer/common/router';
import { updateCustomizeRoute } from '@/renderer/store';

const router = new Router([...pageRoute, ...dialogRoute]);

router.onRoute = (route) => {
  updateCustomizeRoute(route.path);
};

export function routerInit(route: string) {
  router.push(route);
}

export default router;
