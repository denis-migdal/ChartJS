import { CstrArgs } from "./createComponentClass";

export default function createCstrArgsParser<P extends Record<string, any>,
                                             C extends any[],
                                            >(
                            parsePrefix: ((   opts: Partial<P>,
                                           ...args: C) => void)
                                        | null = null ) {

    return (...args: CstrArgs<P, C>) => {
        let opts: Record<string, any> = {};
        let start = 0;
        let end = args.length;

        const last = args[args.length-1]; // out of index gives undefined
        if( typeof last === "object" && ! Array.isArray(last) ) {
            opts = last;
            --end;
        }

        if( typeof args[0] === "string") {
            // @ts-ignore
            opts.name = args[0];
            ++start;
        }

        if( start !== end && parsePrefix !== null)
            parsePrefix( opts as any, ...args.slice(start, end) as any );

        return opts as Partial<P>;
    }
}