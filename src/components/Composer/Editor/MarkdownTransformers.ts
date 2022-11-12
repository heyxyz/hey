import type { Transformer } from '@lexical/markdown';
import { CODE } from '@lexical/markdown';
import { TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from '@lexical/markdown';

/**
 * todo: add transfomers if needed
 */
export const LENSTER_TRANSFORMERS: Array<Transformer> = [
  CODE,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS
];
