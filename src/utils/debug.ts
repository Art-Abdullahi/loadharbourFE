const DEBUG = true;

class Debug {
  log(component: string, ...args: any[]) {
    if (DEBUG) {
      console.log(`[${component}]`, ...args);
    }
  }

  error(component: string, message: string, error?: any) {
    if (DEBUG) {
      console.error(`[${component}] ${message}`, error || '');
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
    }
  }

  warn(component: string, ...args: any[]) {
    if (DEBUG) {
      console.warn(`[${component}]`, ...args);
    }
  }

  render(component: string) {
    if (DEBUG) {
      console.log(`[${component}] Rendering`);
    }
  }

  mount(component: string) {
    if (DEBUG) {
      console.log(`[${component}] Mounted`);
    }
  }

  unmount(component: string) {
    if (DEBUG) {
      console.log(`[${component}] Unmounted`);
    }
  }

  network(method: string, url: string, data?: any) {
    if (DEBUG) {
      console.log(`[Network] ${method} ${url}`, data || '');
    }
  }

  networkError(method: string, url: string, error: any) {
    if (DEBUG) {
      console.error(`[Network Error] ${method} ${url}:`, error);
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
    }
  }
}

export const debug = new Debug();