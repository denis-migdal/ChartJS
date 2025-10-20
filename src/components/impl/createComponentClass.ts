import { buildPropertiesKlass } from "../../Properties";
import ComponentInstance from "./ComponentInstance";
import ComponentRef from "./ComponentRef";
import { ComponentTypeDescriptor } from "./ComponentTypeDescriptor";
import createCstrArgsParser from "./createCstrArgsParser";
import registerDatasetType from "./registerComponent";

const NULL_INTERNALS = {};
const NULL_CREATE_INTERNALS = () => { return NULL_INTERNALS; }

export type CstrArgs<P extends Record<string, any>, C extends any[]> =
    [
        ...([]|[name: string]),
        ...([]|[...C]),
        ...([]|[opts: Partial<P>]),
    ];

export default function createComponentClass<
                        N extends string,
                        P extends Record<string, any>,
                        I extends {},
                        C extends any[] = [],
                    >(descriptor: ComponentTypeDescriptor<N, P, I, C>) {

    const Properties = buildPropertiesKlass(descriptor.properties);

    let createInternals = descriptor.createInternalData!;
    if( createInternals === undefined)
        createInternals = NULL_CREATE_INTERNALS as (this: void) => I;

    const cstrParser = createCstrArgsParser<P, C>(descriptor.cstrArgsParser!);

    class Component extends ComponentRef<P, I> {

        static override readonly name = descriptor.name;

        static descriptor = descriptor;
        
        constructor(...args: CstrArgs<P, C>) {
            super( new ComponentInstance(Properties,
                                         cstrParser(...args),
                                         createInternals(),
                                         descriptor) );
        }
    }

    registerDatasetType(Component);

    return Component;
}