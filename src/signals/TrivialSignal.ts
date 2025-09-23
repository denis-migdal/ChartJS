// Trivial and unoptimized signal implementation.
// See Signals (https://github.com/denis-migdal/Signals) for better implementation.

export type Signal<T> = {
    listen(callback: Callback<T>): void;
    readonly value   : T|null;
    readonly hasValue: boolean;
}

export type Callback<T> = (source: Signal<T>) => void;

export default class TrivialSignal<T> implements Signal<T> {

    listen(callback: Callback<T>) {
        this.#callbacks.push(callback);
        callback(this);
    }

    #value: T|null = null;
    #callbacks = new Array<Callback<T>>();

    get hasValue() {
        return this.#value !== null;
    }

    set value(value: T) {
        this.#value = value;
        for(let i = 0; i < this.#callbacks.length; ++i)
            this.#callbacks[i](this);
    }

    get value(): T|null {
        return this.#value;
    }
}