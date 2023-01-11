// import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';
import { TWEMOJI_HOST } from 'src/constants';

export class EmojiMatcher extends Matcher {
  getEmojiURL = (children: string) => `${TWEMOJI_HOST}/${children.codePointAt(0)?.toString(16)}.svg`;

  replaceWith(children: string) {
    return (
      <img
        className="h-4 w-4 inline-block	align-baseline -mb-0.5"
        src={this.getEmojiURL(children)}
        alt={children.toString()}
      />
    );
  }

  asTag(): string {
    return 'span';
  }

  match(value: string) {
    return this.doMatch(
      value,
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
      (matches) => ({
        match: matches[1]
      })
    );
  }
}
