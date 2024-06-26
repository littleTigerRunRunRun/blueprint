import { BaseSchemes, GetSchemes, NodeId } from 'rete';
import { BaseAreaPlugin } from '../base';
declare type Schemes = GetSchemes<BaseSchemes['Node'] & {
    selected?: boolean;
}, any>;
/**
 * Selector's accumulate function, activated when the ctrl key is pressed
 */
export declare function accumulateOnCtrl(): {
    active(): boolean;
    destroy(): void;
};
export declare type SelectorEntity = {
    label: string;
    id: string;
    unselect(): void;
    translate(dx: number, dy: number): void;
};
/**
 * Selector class. Used to collect selected entities (nodes, connections, etc.) and synchronize them (select, unselect, translate, etc.).
 * Can be extended to add custom functionality.
 */
export declare class Selector<E extends SelectorEntity> {
    entities: Map<string, E>;
    pickId: string | null;
    isSelected(entity: Pick<E, 'label' | 'id'>): boolean;
    add(entity: E, accumulate: boolean): void;
    remove(entity: Pick<E, 'label' | 'id'>): void;
    unselectAll(): void;
    translate(dx: number, dy: number): void;
    pick(entity: Pick<E, 'label' | 'id'>): void;
    release(): void;
    isPicked(entity: Pick<E, 'label' | 'id'>): boolean;
}
/**
 * Selector factory, uses default Selector class
 * @returns Selector instance
 */
export declare function selector<E extends SelectorEntity>(): Selector<E>;
/**
 * Accumulating interface, used to determine whether to accumulate entities on selection
 */
export declare type Accumulating = {
    active(): boolean;
};
export declare type Selectable = ReturnType<typeof selector>;
/**
 * Selectable nodes extension. Adds the ability to select nodes in the area.
 * @param base BaseAreaPlugin instance
 * @param core Selectable instance
 * @param options.accumulating Accumulating interface
 * @listens nodepicked
 * @listens nodetranslated
 * @listens pointerdown
 * @listens pointermove
 * @listens pointerup
 */
export declare function selectableNodes<T>(base: BaseAreaPlugin<Schemes, T>, core: Selectable, options: {
    accumulating: Accumulating;
}): {
    select: (nodeId: NodeId, accumulate: boolean) => void;
    unselect: (nodeId: NodeId) => void;
};
export {};
//# sourceMappingURL=selectable.d.ts.map