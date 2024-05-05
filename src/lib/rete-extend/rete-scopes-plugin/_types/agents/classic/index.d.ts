import { AgentContext, AgentParams, ScopeAgent } from '../types';
export declare type DefaultScopesAgentParams = AgentParams & {
    timeout?: number;
};
export declare const useScopeAgent: ScopeAgent;
export declare function useVisualEffects<T>(params: DefaultScopesAgentParams, { area, editor, scopes }: AgentContext<T>): void;
//# sourceMappingURL=index.d.ts.map