export class Router {
  constructor() {
    this.routes = new Map();
    this.current = '';
  }

  register(route, handler) {
    this.routes.set(route, handler);
  }

  navigate(route, payload = {}) {
    const handler = this.routes.get(route);
    if (!handler) {
      throw new Error(`Unknown route: ${route}`);
    }
    this.current = route;
    handler(payload);
  }
}
