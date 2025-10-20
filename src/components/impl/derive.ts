import { ComponentTypeDescriptor } from "./ComponentTypeDescriptor";
import createComponentClass from "./createComponentClass";

export default function derive<
                N1 extends string,
                N2 extends string,
                P1 extends Record<string, any>,
                P2 extends Record<string, any>,
                I extends {},
                C1 extends any[],
                C2 extends any[] = C1,
            >(parent: {descriptor: ComponentTypeDescriptor<N1, P1, I, C1>},
              extra : {
                        name           : N2,
                        // we assume a derivation must have different properties.
                        properties     : P2,
                    } & Partial<Omit<ComponentTypeDescriptor<N2, P1&P2, I, C2>, "properties">>
            ) : ReturnType<typeof createComponentClass<N2, P1&P2, I, C2>> {

    const new_descriptor = {
        ...parent.descriptor, // not ideal but well...
        ...extra,
        properties: {
            ...parent.descriptor.properties,
            ...extra.properties
        }
    }

    return createComponentClass(new_descriptor as any) as any;
}