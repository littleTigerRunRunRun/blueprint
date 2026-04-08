import { Position } from '../types';
type Translate = (dx: number, dy: number) => void;
type StartEvent = {
    pageX: number;
    pageY: number;
};
export declare function useDrag(translate: Translate, getPointer: (e: StartEvent) => Position): {
    start(e: StartEvent): void;
};
export {};
//# sourceMappingURL=drag.d.ts.map