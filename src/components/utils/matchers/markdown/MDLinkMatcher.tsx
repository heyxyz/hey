import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';
import { v4 as uuidv4 } from 'uuid';
// create props for the matcher

// create customLink function to wrap html anchor element
const customLink = (href: string | undefined, display: string | undefined) => {
  console.log(`href: ${JSON.stringify(href)}, display: ${display}`);
  const keyId = '_' + href + '-' + uuidv4().slice(-7);
  console.log(`keyId: ${keyId}`);
  return (
    <a key={href + uuidv4().slice(-7)} href={href} target="_blank">
      {display}
    </a>
  );
};
export class MDLinkMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: any) {
    // return <a>{children[1]}</a>;
    console.log(`children: ${children.toString()}`);
    console.log(`props: ${JSON.stringify(props)}`);
    console.log(`props: ${props}`);
    console.log(`props.href: ${props.href}`);
    console.log(`props.title: ${props.title}`);

    // console.log(`children1: ${children[0]}`);
    // console.log(`children2: ${children[1]}`);

    // console.log(`props: ${props.toString()}`);
    // const hrefVal = `<a href="${children[0]}">${children[1]}</a>`;
    // return <a href={children?.[1]}>{children?.[0]}</a>;
    // return <a>{children[0]}</a>; // title
    // return <a>{children[1]}</a>; // link

    return customLink(props.href, props.title);

    // return customLink(children[1]?.toString(), children[0]?.toString());
  }

  asTag(): string {
    return 'a';
  }

  match(value: string) {
    // console.log(value);
    const matchVal = this.doMatch(value, /\[(.*?)\]\((.*?)\)/u, (matches) => ({
      match: matches
    }));
    console.log(`matchVal: ${matchVal}`);
    return this.doMatch(value, /\[(.*?)\]\((.*?)\)/u, (matches) => ({
      // match: matches[1] + matches[2]
      match: matches[1] + matches[2],
      href: matches[2],
      title: matches[1]

      // props: {
      //   href: matches[2],
      //   title: matches[1]
      // }
    }));
  }
}
