import type { Transformer } from '@lexical/markdown';
import { BOLD_STAR } from '@lexical/markdown';
import { BOLD_ITALIC_UNDERSCORE, CODE } from '@lexical/markdown';
import { TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from '@lexical/markdown';
console.log(CODE, TEXT_FORMAT_TRANSFORMERS);
export const LENSTER_TRANSFORMERS: Array<Transformer> = [
  CODE,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS
];
