import { Cancelable } from 'lodash';
// An actual proper debounce that works with async stuff
// Ripped from 'debounce-async'

/**
 * debounce(func, [wait=0], [options={}])
 *
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading edge of the timeout.
 * @param {cancelObj} [options.cancelObj='canceled'] Specify the error object to be rejected.
 * @returns {Function} Returns the new debounced function.
 */
function debounce<T extends (...args: any) => any>(
    func: T,
    wait = 0,
    { leading = false, cancelObj = 'canceled' } = {}
): T & Cancelable {
    let timerId: number | null,
        latestResolve: Function | null,
        shouldCancel: boolean;

    return function(this: T, ...args: any) {
        if (!latestResolve) {
            // The first call since last invocation.
            return new Promise((resolve, reject) => {
                latestResolve = resolve;
                if (leading) {
                    invokeAtLeading.apply(this, [args, resolve, reject]);
                } else {
                    timerId = window.setTimeout(
                        invokeAtTrailing.bind(this, args, resolve, reject),
                        wait
                    );
                }
            });
        }

        shouldCancel = true;
        return new Promise((resolve, reject) => {
            latestResolve = resolve;
            timerId = window.setTimeout(
                invokeAtTrailing.bind(this, args, resolve, reject),
                wait
            );
        });
    } as T & Cancelable;

    function invokeAtLeading(
        this: T,
        args: any[],
        resolve: Function,
        reject: Function
    ) {
        func.apply(this, args)
            .then(resolve)
            .catch(reject);
        shouldCancel = false;
    }

    function invokeAtTrailing(
        this: T,
        args: any,
        resolve: Function,
        reject: Function
    ) {
        if (shouldCancel && resolve !== latestResolve) {
            reject(cancelObj);
        } else {
            func.apply(this, args)
                .then(resolve)
                .catch(reject);
            shouldCancel = false;
            window.clearTimeout(timerId!);
            timerId = null;
            latestResolve = null;
        }
    }
}

export default debounce;
