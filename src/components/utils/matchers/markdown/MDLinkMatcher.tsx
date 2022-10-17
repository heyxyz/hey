import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';

// create props for the matcher

export class MDLinkMatcher extends Matcher {
  replaceWith(children: ChildrenNode | undefined) {
    // return <a>{children[1]}</a>;
    console.log(`children: ${children}`);
    // console.log(`children1: ${children[0]}`);
    // console.log(`children2: ${children[1]}`);

    // console.log(`props: ${props.toString()}`);
    // const hrefVal = `<a href="${children[0]}">${children[1]}</a>`;
    return <a href={children?.[1]}>{children?.[0]}</a>;
  }

  asTag(): string {
    return 'a';
  }

  match(value: string) {
    // console.log(value);
    // const matchVal = this.doMatch(value, /\[(.*?)\]\((.*?)\)/u, (matches) => ({
    //   match: matches[1] + matches[2]
    // }));

    return this.doMatch(value, /\[(.*?)\]\((.*?)\)/u, (matches) => ({
      match: matches[1] + matches[2]
    }));
  }
}
