import { ComponentTypeDescriptor, ComponentTypeUpdateCallback } from "./ComponentTypeDescriptor";
import createComponentClass from "./createComponentClass";
import derive from "./derive";

// more unsafe
export default function override<
                N1 extends string,
                N2 extends string,
                P1 extends Record<string, any>,
                P2 extends Record<string, any>,
                I extends {},
                C1 extends any[],
                C2 extends any[] = C1,
            >(parent: {descriptor: ComponentTypeDescriptor<N1, P1, I, C1>},
              extra : {
                        name      : N2,
                        properties: P2,
                        onUpdate  : ComponentTypeUpdateCallback<Merge<P1,P2>, I>
                    } & Partial<Omit<ComponentTypeDescriptor<N2, Merge<P1,P2>, I, C2>, "properties">>
            ) : ReturnType<typeof createComponentClass<N2, Merge<P1,P2>, I, C2>> {

    return derive(parent, extra as any) as any;
}

type Merge<A extends Record<string, any>,
           B extends Record<string, any>
        > = {
    [K in keyof A | keyof B]: K extends keyof B ? B[K]
                                                : K extends keyof A
                                                    ? A[K]
                                                    : never;
}