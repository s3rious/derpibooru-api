type Safe<T> = { success: true; data: T } | { success: false; error: string };

interface SafeOptions<E = unknown> {
  errorMessage?: string;
  processError?: (error: E) => string;
}

function safe<T, E = unknown>(
  promise: Promise<T>,
  options?: SafeOptions<E>,
): Promise<Safe<T>>;
function safe<T, E = unknown>(func: () => T, options?: SafeOptions<E>): Safe<T>;
function safe<T, E = unknown>(
  promiseOrFunc: Promise<T> | (() => T),
  options?: SafeOptions<E>,
): Promise<Safe<T>> | Safe<T> {
  if (promiseOrFunc instanceof Promise) {
    return safeAsync(promiseOrFunc, options ?? {});
  }
  return safeSync(promiseOrFunc, options ?? {});
}

async function safeAsync<T, E = unknown>(
  promise: Promise<T>,
  options: SafeOptions<E>,
): Promise<Safe<T>> {
  try {
    const data = await promise;
    return { data, success: true };
  } catch (localError) {
    if (options.errorMessage !== undefined) {
      return { success: false, error: options.errorMessage };
    }

    if (localError instanceof Error) {
      return { success: false, error: localError.message };
    }

    if (options.processError !== undefined) {
      return { success: false, error: options.processError(localError as E) };
    }

    return { success: false, error: "Something went wrong" };
  }
}

function safeSync<T, E = unknown>(
  func: () => T,
  options: SafeOptions<E>,
): Safe<T> {
  try {
    const data = func();
    return { data, success: true };
  } catch (localError) {
    if (options.errorMessage !== undefined) {
      return { success: false, error: options.errorMessage };
    }

    if (localError instanceof Error) {
      return { success: false, error: localError.message };
    }

    if (options.processError !== undefined) {
      return { success: false, error: options.processError(localError as E) };
    }

    return { success: false, error: "Something went wrong" };
  }
}

export { type Safe, type SafeOptions, safe };
