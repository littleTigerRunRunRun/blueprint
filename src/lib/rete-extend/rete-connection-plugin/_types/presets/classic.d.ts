import { ClassicFlow, ClassicParams } from '../flow';
import { ClassicScheme } from '../types';
/**
 * Classic preset. Uses `ClassicFlow` for managing connections by user
 */
export declare function setup<Schemes extends ClassicScheme>(params?: Partial<ClassicParams<Schemes>>): () => ClassicFlow<Schemes, any[]>;
//# sourceMappingURL=classic.d.ts.map