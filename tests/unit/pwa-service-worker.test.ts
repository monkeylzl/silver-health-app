import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

test('iOS document requests return the cached page without waiting for network', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  const cachedPage = new Response('<main>cached today</main>', {
    headers: { 'content-type': 'text/html' },
  });

  const context = vm.createContext({
    URL,
    Request,
    Response,
    Promise,
    setTimeout: () => 1,
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
      mode: 'cors',
      destination: 'document',
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

test('Next.js build assets return from cache without waiting for the network', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  const cachedStyles = new Response('body { color: rgb(1, 2, 3); }', {
    headers: { 'content-type': 'text/css' },
  });

  const context = vm.createContext({
    URL,
    Request,
    Response,
    Promise,
    setTimeout: () => 1,
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
        return url?.includes('/_next/static/') ? cachedStyles.clone() : undefined;
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
      mode: 'cors',
      destination: 'style',
      url: 'https://web.example.test/_next/static/css/app-build.css',
    },
    respondWith: (promise: Promise<Response>) => {
      responsePromise = promise;
    },
  });

  assert.ok(responsePromise, 'Next.js build assets should be handled by the service worker');
  const response = await Promise.race([
    responsePromise,
    new Promise<undefined>((resolve) => setTimeout(resolve, 50)),
  ]);

  assert.ok(response, 'cached build assets should not wait forever for the network');
  assert.equal(await response.text(), 'body { color: rgb(1, 2, 3); }');
});

test('tab navigation does not reuse data from an incompatible RSC request', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  const cachedData = new Response('1:["cached health tab"]', {
    headers: { 'content-type': 'text/x-component' },
  });
  const freshData = new Response('1:["fresh health tab"]', {
    headers: { 'content-type': 'text/x-component' },
  });

  const context = vm.createContext({
    URL,
    Request,
    Response,
    Promise,
    setTimeout,
    clearTimeout,
    fetch: async () => freshData.clone(),
    caches: {
      keys: async () => [],
      delete: async () => true,
      open: async () => ({
        addAll: async () => undefined,
        put: async () => undefined,
        delete: async () => true,
        keys: async () => [{ url: 'https://web.example.test/health?_rsc=previous-build' }],
        match: async () => cachedData.clone(),
      }),
      match: async () => undefined,
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
      mode: 'cors',
      destination: '',
      url: 'https://web.example.test/health?_rsc=tab123',
    },
    respondWith: (promise: Promise<Response>) => {
      responsePromise = promise;
    },
    waitUntil: () => undefined,
  });

  assert.ok(responsePromise, 'tab data should be handled by the service worker');
  const response = await responsePromise;
  assert.equal(await response.text(), '1:["fresh health tab"]');
});
