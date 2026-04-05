import * as React from 'react';
import { ClassicPreset, NodeId } from 'rete';
import { ClassicScheme, ReactArea2D, Side, InOut } from '../../types';
type Props<Scheme extends ClassicScheme> = {
    name: string;
    emit: (props: ReactArea2D<Scheme>) => void;
    side: Side;
    inout?: InOut;
    nodeId: NodeId;
    socketKey: string;
    payload: ClassicPreset.Socket;
};
export declare function RefSocket<Scheme extends ClassicScheme>({ name, emit, nodeId, side, inout, socketKey, payload, ...props }: Props<Scheme>): React.JSX.Element;
export {};
//# sourceMappingURL=RefSocket.d.ts.map