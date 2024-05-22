import * as React from 'react';
import { Position } from '../../../types';
import { ClassicScheme } from '../types';
export declare type ConnectionContextValue = {
    start: Position | null;
    end: Position | null;
    path: null | string;
};
declare type PositionWatcher = (cb: (value: Position) => void) => (() => void);
declare type Props<Schemes extends ClassicScheme> = {
    Component: (props: {
        data: ClassicScheme['Connection'] & {
            isLoop?: boolean;
        };
        start: Position | null;
        end: Position | null;
        path: string | null;
        styles?: () => any;
    }) => React.JSX.Element | null;
    payload: Schemes['Connection'];
    start: Position | PositionWatcher;
    end: Position | PositionWatcher;
    path(start: Position, end: Position): Promise<null | string>;
};
export declare function ConnectionWrapper<Schemes extends ClassicScheme>(props: Props<Schemes>): React.JSX.Element;
export {};
//# sourceMappingURL=ConnectionWrapper.d.ts.map