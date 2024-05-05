import { NodeEditor, NodeId, Root, Scope } from 'rete';
import { BaseArea, BaseAreaPlugin } from 'rete-area-plugin';
import { Scopes } from '..';
import { ExpectedScheme, Padding, Size } from '../types';
import { Translate } from '../utils';
export declare type AgentContext<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, BaseArea<ExpectedScheme> | T>;
    scopes: Scope<Scopes, [BaseArea<ExpectedScheme>, Root<ExpectedScheme>]>;
};
export declare type AgentParams = {
    padding: (id: NodeId) => Padding;
    size: (id: NodeId, size: Size) => Size;
    exclude: (id: NodeId) => boolean;
    elder: (id: NodeId) => boolean;
    translate: Translate;
};
export declare type ScopeAgent = <T>(params: AgentParams, context: AgentContext<T>) => void;
//# sourceMappingURL=types.d.ts.map