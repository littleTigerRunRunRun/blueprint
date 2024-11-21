import { Position, Side, InOut } from '../types';
declare type SocketPayload = {
    element: HTMLElement;
    side: Side;
    key: string;
    nodeId: string;
    position: Position;
    inout?: InOut;
};
export declare class SocketsPositionsStorage {
    elements: Map<HTMLElement, SocketPayload[]>;
    getPosition(data: {
        nodeId: string;
        key: string;
        side: Side;
    }): Position | null;
    add(data: SocketPayload): void;
    remove(element: SocketPayload['element']): void;
    snapshot(): SocketPayload[];
}
export {};
//# sourceMappingURL=storage.d.ts.map