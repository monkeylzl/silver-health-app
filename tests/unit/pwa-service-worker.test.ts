import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

test('navigation falls back to the cached page when network fetch stays pending', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  const cachedPage = new Response('<main>cached today</main>', {
    headers: { 'content-type': 'text/html' },
  });

  const context = vm.createContext({
    URL,
    Request,
    Response,
    Promise,
    setTimeout: (callback: () => void) => setTimeout(callback, 0),
    clearTimeout,
    fetch: () => new Promise<Response>(() => undefined),
    caches: {
      keys: async () => [],
      delete: async () => true,
      open: async () => ({
        addAll: async () => undefined,
        put: async () => undefined,
      }),
      match: async (request: { url?: string } | string) => {
        const url = typeof request === 'string' ? request : request.url;
        return url?.endsWith('/') ? cachedPage.clone() : undefined;
      },
    },
    self: {
      location: { origin: 'https://web.example.test' },
      clients: { claim: () => undefined },
      skipWaiting: () => undefined,
      addEventListener: (type: string, listener: (event: unknown) => void) => {
        listeners.set(type, listener);
      },
    },
  });

  const source = readFileSync(join(process.cwd(), 'apps/web/public/sw.js'), 'utf8');
  vm.runInContext(source, context);

  let responsePromise: Promise<Response> | undefined;
  listeners.get('fetch')?.({
    request: {
      method: 'GET',
      mode: 'navigate',
      url: 'https://web.example.test/',
    },
    respondWith: (promise: Promise<Response>) => {
      responsePromise = promise;
    },
  });

  assert.ok(responsePromise, 'navigation should be handled by the service worker');
  const response = await Promise.race([
    responsePromise,
    new Promise<undefined>((resolve) => setTimeout(resolve, 50)),
  ]);

  assert.ok(response, 'cached navigation should not wait forever for the network');
  assert.equal(await response.text(), '<main>cached today</main>');
});
