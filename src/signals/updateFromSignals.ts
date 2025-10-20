import ComponentRef from "../components/impl/ComponentRef";
import { Properties } from "../Properties";
import { Signal } from "./TrivialSignal";

type GetSignalValue<T> = T extends Signal<infer U> ? U : never;
type GetSignalValues<T extends any[]> = {
    [key in keyof T]: GetSignalValue<T[key]>|null
}

type GetProperties<T extends ComponentRef<any,any>> = T extends ComponentRef<infer P, infer _> ? P : never;

type Callback<P extends Record<string, any>,
              S extends Signal<any>[]> = (properties: Properties<P>,
                                        ...params: GetSignalValues<S>) => void;

export default function updateFromSignals<T extends ComponentRef<any,any>,
                                          S extends Signal<any>[]>(
                                            target: T,
                                            ...args: [...signals: S, update: Callback<NoInfer<GetProperties<T>>, NoInfer<S>>]
                                        ) {
    const callback: Callback<GetProperties<T>, S> = args[args.length-1] as any;
    const signals : S              = args.slice(0,-1)    as any;

    let dirty    = false;
    const values = new Array(signals.length) as GetSignalValues<S>;

    target.addUpdater( () => {

        if( dirty === false) return; // no changes to apply.

        for(let i = 0; i < signals.length; ++i)
            values[i] = signals[i].value;

        callback(target.properties, ...values);
        dirty = false;
    });

    const rqUpdate = () => {
        if( dirty === true) return; // update already requested.
        
        (target as any).target.requestUpdate();
        dirty = true;
    }
    for(let i = 0; i < signals.length; ++i)
        signals[i].listen( rqUpdate );

    return target;
}