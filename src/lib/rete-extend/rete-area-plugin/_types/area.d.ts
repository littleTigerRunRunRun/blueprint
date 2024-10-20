import { Content } from './content';
import { Drag } from './drag';
import { Position } from './types';
import { Zoom, ZoomSource, DblclickFilter } from './zoom';
export declare type Transform = Position & {
    k: number;
};
export declare type TranslateEventParams = {
    previous: Transform;
    position: Position;
};
export declare type ZoomEventParams = {
    previous: Transform;
    zoom: number;
    source?: ZoomSource;
};
declare type Events = {
    zoomed: (params: ZoomEventParams) => Promise<unknown>;
    pointerDown: (position: Position, event: PointerEvent) => void;
    pointerMove: (position: Position, event: PointerEvent) => void;
    pointerUp: (position: Position, event: PointerEvent) => void;
    resize: (event: Event) => void;
    translated: (params: TranslateEventParams) => Promise<unknown>;
    reordered: (element: HTMLElement) => Promise<unknown>;
};
declare type Guards = {
    translate: (params: TranslateEventParams) => Promise<unknown | boolean>;
    zoom: (params: ZoomEventParams) => Promise<unknown | boolean>;
};
export declare type AreaFilter = {
    zoom?: {
        dblclick?: DblclickFilter;
    };
    move?: {
        limit?: (x: number, y: number, id: string) => {
            x: number;
            y: number;
        };
    };
};
export declare class Area {
    private container;
    private events;
    private guards;
    filter: AreaFilter;
    transform: Transform;
    pointer: Position;
    content: Content;
    private zoomHandler;
    private dragHandler;
    constructor(container: HTMLElement, events: Events, guards: Guards, filter: AreaFilter);
    private update;
    /**
     * Drag handler. Destroy previous drag handler if exists.
     * @param drag drag handler
     * @example area.area.setDragHandler(null) // disable drag
     */
    setDragHandler(drag: Drag | null): void;
    /**
     * Set zoom handler. Destroy previous zoom handler if exists.
     * @param zoom zoom handler
     * @example area.area.setZoomHandler(null) // disable zoom
     */
    setZoomHandler(zoom: Zoom | null): void;
    setPointerFrom(event: MouseEvent): void;
    private pointerdown;
    private pointermove;
    private pointerup;
    private resize;
    private onTranslate;
    private onZoom;
    /**
     * Change position of the area
     * @param x desired x coordinate
     * @param y desired y coordinate
     * @returns true if the translation was successful, false otherwise
     * @emits translate
     * @emits translated
     */
    translate(x: number, y: number): Promise<boolean>;
    /**
     * Change zoom level of the area
     * @param zoom new zoom level
     * @param ox x coordinate of the origin of the zoom
     * @param oy y coordinate of the origin of the zoom
     * @param source source of the zoom
     * @returns true if the zoom was successful, false otherwise
     * @emits zoom
     * @emits zoomed
     */
    zoom(zoom: number, ox?: number, oy?: number, source?: ZoomSource): Promise<boolean>;
    destroy(): void;
}
export {};
//# sourceMappingURL=area.d.ts.map