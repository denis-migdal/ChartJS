import {Cstr} from "@misc/types/Cstr";
import Chart from "../../Chart";
import Component from "../../Component";

export type WithComponent<T extends Cstr<Component> & {name: string}> = 
  Record<`create${T["name"]}`, (...args: ConstructorParameters<T>) => InstanceType<T>>
& Record<`add${T["name"]}`   , (...args: ConstructorParameters<T>) => Chart>;

export default function registerDatasetType<T extends Cstr<Component> & {name: string} >(Klass: T) {

    const    addMeth =    `add${Klass.name}` as const;
    const createMeth = `create${Klass.name}` as const;

    // @ts-ignore
    Chart.prototype[createMeth] = function(...args: any[]) {
        const dataset = new Klass(...args);
        this.append(dataset);
        return dataset;
    }

    // @ts-ignore
    Chart.prototype[addMeth] = function(...args: any[]) {
        // @ts-ignore
        this[createMeth](...args as any);
        return this;
    }
}