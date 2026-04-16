import { NodeEditor, NodeId } from 'rete';
import { BaseArea, BaseAreaPlugin } from 'rete-area-plugin';
import { ExpectedScheme } from './types';
type Props<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, BaseArea<ExpectedScheme> | T>;
};
export declare function bringForward<T>(nodeId: NodeId, props: Props<T>): void;
export declare function useOrdering<T>(props: Props<T>): void;
export {};
//# sourceMappingURL=ordering.d.ts.map