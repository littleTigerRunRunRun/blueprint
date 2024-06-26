import { BaseSchemes, ConnectionId, NodeId, Root } from 'rete';
import { type AreaFilter, Area, TranslateEventParams, ZoomEventParams } from './area';
import { BaseArea, BaseAreaPlugin } from './base';
import { ConnectionView } from './connection-view';
import { NodeView } from './node-view';
import { GetRenderTypes, Position } from './types';
export type { AreaFilter } from './area';
export { Area } from './area';
export type { BaseArea } from './base';
export { BaseAreaPlugin } from './base';
export { Drag } from './drag';
export * as AreaExtensions from './extensions';
export { NodeView } from './node-view';
export type { RenderSignal } from './types';
export type { PointerListener } from './utils';
export { usePointerListener } from './utils';
export { Zoom } from './zoom';
/**
 * A union of all possible signals that can be emitted by the area
 * @priority 9
 */
export declare type Area2D<Schemes extends BaseSchemes> = BaseArea<Schemes> | {
    type: 'translate';
    data: TranslateEventParams;
} | {
    type: 'translated';
    data: TranslateEventParams;
} | {
    type: 'zoom';
    data: ZoomEventParams;
} | {
    type: 'zoomed';
    data: ZoomEventParams;
} | {
    type: 'resized';
    data: {
        event: Event;
    };
};
export declare type Area2DInherited<Schemes extends BaseSchemes, ExtraSignals = never> = [Area2D<Schemes> | ExtraSignals, Root<Schemes>];
/**
 * A plugin that provides a 2D area for nodes and connections
 * @priority 8
 * @emits render
 * @emits rendered
 * @emits unmount
 * @listens nodecreated
 * @listens noderemoved
 * @listens connectioncreated
 * @listens connectionremoved
 */
export declare class AreaPlugin<Schemes extends BaseSchemes, ExtraSignals = never> extends BaseAreaPlugin<Schemes, Area2D<Schemes> | ExtraSignals> {
    container: HTMLElement;
    nodeViews: Map<string, NodeView>;
    connectionViews: Map<string, ConnectionView>;
    area: Area;
    private elements;
    constructor(container: HTMLElement, filter?: AreaFilter);
    private onContextMenu;
    addNodeView(node: Schemes['Node']): NodeView;
    removeNodeView(id: NodeId): void;
    addConnectionView(connection: Schemes['Connection']): ConnectionView;
    removeConnectionView(id: ConnectionId): void;
    /**
     * Force update rendered element by id (node, connection, etc.)
     * @param type Element type
     * @param id Element id
     * @emits render
     */
    update(type: GetRenderTypes<Area2D<Schemes>> | GetRenderTypes<ExtraSignals>, id: string): Promise<void>;
    /**
     * Resize node
     * @param id Node id
     * @param width Desired width
     * @param height Desired height
     */
    resize(id: NodeId, width: number, height: number): Promise<boolean | undefined>;
    /**
     * Translate node to position
     * @param id Node id
     * @param position Position
     */
    translate(id: NodeId, { x, y }: Position): Promise<boolean | undefined>;
    /**
     * Destroy all views and remove all event listeners
     */
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map