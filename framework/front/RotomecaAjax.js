class RotomecaAjax {
  /**
   *
   * @param {*} url
   * @param {*} param1
   * @returns {RotomecaPromise<T>}
   * @template {any} T
   */
  static Call(
    url,
    {
      method = this.AjaxMethod.get,
      headers = null,
      body = null,
      mode = undefined,
      cache = 'default',
      redirect = 'manual',
      referrer = 'client',
      referrerPolicy = undefined,
      integrity = undefined,
      keepalive = undefined,
      credentials = undefined,
      onSuccess = null,
      onFailed = null,
    } = {},
  ) {
    return new RotomecaPromise((resolver, url) => {
      method = Object.keys(EAjaxMethod)
        .find((x) => EAjaxMethod[x] === method)
        .toUpperCase();

      let abort = new AbortController();

      let init = {
        method,
        cache,
        redirect,
        referrer,
        signal: abort.signal,
      };

      if (headers) init.headers = headers;
      if (body) init.body = body;
      if (mode) init.mode = mode;
      if (referrerPolicy) init.referrerPolicy = referrerPolicy;
      if (integrity) init.integrity = integrity;
      if (credentials) init.credentials = credentials;
      if (keepalive !== undefined && keepalive !== null)
        init.keepalive = keepalive;

      const interval = setInterval(() => {
        if (resolver.state === EPromiseState.cancelled) {
          clearInterval(interval);
          abort.abort();
        }
      }, 10);
      fetch(url, init).then(
        async (data) => {
          if (data === undefined) data = noAjaxData;

          if (onSuccess) {
            if (onSuccess.constructor.name === 'AsyncFunction')
              data = (await onSuccess(data)) ?? data;
            else data = onSuccess(data) ?? data;
          }

          clearInterval(interval);
          resolver.resolver.resolve(data);
        },
        async (reason) => {
          if (onFailed) {
            if (onFailed.constructor.name === 'AsyncFunction')
              reason = (await onFailed(reason)) ?? reason;
            else reason = onFailed(reason) ?? reason;
          }

          clearInterval(interval);
          resolver.resolver.reject(reason);
        },
      );
    }, url);
  }

  static Get(
    url,
    { onSuccess = null, onFailed = null } = {},
    {
      headers = null,
      mode = undefined,
      cache = 'default',
      redirect = 'manual',
      referrer = 'client',
      referrerPolicy = undefined,
      integrity = undefined,
      keepalive = undefined,
      credentials = undefined,
    } = {},
  ) {
    return this.Call(url, {
      method: this.AjaxMethod.get,
      headers,
      mode,
      cache,
      redirect,
      referrer,
      referrerPolicy,
      integrity,
      keepalive,
      credentials,
      onSuccess,
      onFailed,
    });
  }

  static Post(
    url,
    { onSuccess = null, onFailed = null, data = null } = {},
    {
      headers = null,
      mode = undefined,
      cache = 'default',
      redirect = 'manual',
      referrer = 'client',
      referrerPolicy = undefined,
      integrity = undefined,
      keepalive = undefined,
      credentials = undefined,
    } = {},
  ) {
    return this.Call(url, {
      method: this.AjaxMethod.post,
      body: data,
      headers,
      mode,
      cache,
      redirect,
      referrer,
      referrerPolicy,
      integrity,
      keepalive,
      credentials,
      onSuccess,
      onFailed,
    });
  }

  /**
   * @type {typeof EAjaxMethod}
   * @readonly
   * @static
   */
  static get AjaxMethod() {
    return EAjaxMethod;
  }

  /**
   * @type {Symbol}
   * @readonly
   * @static
   */
  static get NoAjaxData() {
    return noAjaxData;
  }
}
