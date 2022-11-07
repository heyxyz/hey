import type { Transformer } from '@lexical/markdown';
import { ELEMENT_TRANSFORMERS } from '@lexical/markdown';
import { TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from '@lexical/markdown';

export const LENSTER_TRANSFORMERS: Array<Transformer> = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS
];
