export function $(selector) {
    return document.querySelector(selector);
}

export function $$(selector) {
    return document.querySelectorAll(selector);
}

export function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function debounce(fn, ms) {
    let timer;
    return function () {
        const context = this;
        clearTimeout(timer);

        timer = setTimeout(function () {
            fn.call(context);
        }, ms);
    };
}
