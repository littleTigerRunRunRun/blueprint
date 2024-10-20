/**
 * Zoom source
 */
export declare type ZoomSource = 'wheel' | 'touch' | 'dblclick';
export declare type OnZoom = (delta: number, ox: number, oy: number, source?: ZoomSource) => void;
export declare type DblclickFilter = (delta: number) => number;
/**
 * Zoom class, used to handle zooming of the area. Can be extended to add custom behavior.
 * @internal
 */
export declare class Zoom {
    protected intensity: number;
    private filter?;
    protected previous: {
        cx: number;
        cy: number;
        distance: number;
    } | null;
    protected pointers: PointerEvent[];
    protected container: HTMLElement;
    protected element: HTMLElement;
    protected onzoom: OnZoom;
    constructor(intensity: number, filter?: {
        dblclick?: DblclickFilter | undefined;
    } | undefined);
    initialize(container: HTMLElement, element: HTMLElement, onzoom: OnZoom): void;
    protected wheel: (e: WheelEvent) => void;
    private getTouches;
    protected down: (e: PointerEvent) => void;
    protected move: (e: PointerEvent) => void;
    protected contextmenu: () => void;
    protected up: (e: PointerEvent) => void;
    protected dblclick: (e: MouseEvent) => void;
    isTranslating(): boolean;
    destroy(): void;
}
//# sourceMappingURL=zoom.d.ts.map