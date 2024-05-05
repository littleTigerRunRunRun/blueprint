import { NodeEditor, NodeId, Root, Scope } from 'rete';
import { BaseArea, BaseAreaPlugin } from 'rete-area-plugin';
import { Preset } from './presets/types';
import { ExpectedScheme, Padding, Size } from './types';
export * as Presets from './presets';
/**
 * Props for `ScopesPlugin` class.
 */
export declare type Props = {
    /** Padding (space) between the scope's border and its children. Default is `() => ({ top: 40, left: 20, right: 20, bottom: 20 })` */
    padding?: (id: NodeId) => Padding;
    /** Determines whether the nested node should be excluded from affecting the scope's size, etc. Default is `() => false` */
    exclude?: (id: NodeId) => boolean;
    /** Customizes the size of the node which is recognized as a parent. Default is `(id, size) => size` */
    size?: (id: NodeId, size: Size) => Size;
    /** 决定这个目标节点是否具备父级能力 */
    elder?: (id: NodeId) => boolean;
};
declare type Requires<Schemes extends ExpectedScheme> = BaseArea<Schemes>;
/**
 * Signal types produced by ConnectionPlugin instance
 * @priority 10
 */
export declare type Scopes = {
    type: 'scopepicked';
    data: {
        ids: NodeId[];
    };
} | {
    type: 'scopereleased';
    data: {
        ids: NodeId[];
    };
};
/**
 * Scope plugin. Responsible for user interaction with scopes (nested nodes, groups)
 * @priority 9
 * @listens nodetranslated
 * @listens noderemoved
 * @emits scopepicked
 * @emits scopereleased
 */
export declare class ScopesPlugin<Schemes extends ExpectedScheme, T = never> extends Scope<Scopes, [Requires<Schemes>, Root<Schemes>]> {
    padding: (id: NodeId) => Padding;
    exclude: (id: NodeId) => boolean;
    elder: (id: NodeId) => boolean;
    size: (id: NodeId, size: Size) => Size;
    editor: NodeEditor<Schemes>;
    area: BaseAreaPlugin<Schemes, T>;
    presets: Preset[];
    constructor(props?: Props);
    setParent(scope: Scope<BaseArea<Schemes>, [Root<Schemes>]>): void;
    /**
     * Adds a preset to the plugin.
     * @param preset Preset that is responsible for user interactions with scopes (e.g. assigning nodes to scopes)
     */
    addPreset(preset: Preset): void;
    isDependent(id: NodeId): boolean;
}
export declare function getPickedNodes<S extends ExpectedScheme>(scopes: Scope<Scopes, [Requires<S>, Root<S>]>): string[];
//# sourceMappingURL=index.d.ts.map