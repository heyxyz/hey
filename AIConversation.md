# Chat Transcript - Tab 1

## User:

Please consult @AIMAP.md .

Where to change the "Welcome to {app-name},
a social network built on Lens Protocol"?

I want to change it to:
"Welcome to {app-name},
the forefront of <a href="https://medium.com/@HashBrown_Research/deso-the-future-of-web3-socialfi-1b38d7e1939d" target="_blank">DeSo</a> innovation on Lens Protocol".

## AI (gpt-4-turbo-2024-04-09):

To update the welcome message in the `Hero.tsx` component of the `apps/web` application, you need to modify the text within the `div` element that currently displays the message about the Lens Protocol. Here's how you can change it to include the new message with a hyperlink:

```16:20:apps/web/src/components/Home/Hero.tsx
            Welcome to {APP_NAME},
          </div>
          <div className="ld-text-gray-500 text-2xl font-extrabold sm:text-5xl">
            a social network built on Lens Protocol
          </div>
```

Here is the updated code snippet:

```typescript
<div className="text-2xl font-extrabold sm:text-5xl">
  Welcome to {APP_NAME},
</div>
<div className="ld-text-gray-500 text-2xl font-extrabold sm:text-5xl">
  the forefront of <a href="https://medium.com/@HashBrown_Research/deso-the-future-of-web3-socialfi-1b38d7e1939d" target="_blank">DeSo</a> innovation on Lens Protocol
</div>
```

This change will update the welcome message to include a link to the article about DeSo innovation, opening in a new tab when clicked.

## User:

Don't you think you're fooling?

Why <a> in a NextJS React app?
Please look at other files, about how the codebase handles links. Import it correctly, change the element accordingly.

## AI (gpt-4-turbo-2024-04-09):

You're right; using a raw `<a>` tag in a Next.js React application for internal navigation isn't the best practice due to potential performance issues and lack of client-side navigation handling. Instead, you should use the `Link` component from `next/link` for internal links, which handles client-side navigation without a full page refresh.

Here's how you can correctly import and use the `Link` component in your `Hero.tsx` component:

```typescript
import { FC } from 'react';
import Link from 'next/link';
import { APP_NAME } from '@hey/data/constants';

const Hero: FC = () => {
  return (
    <div className="divider py-12">
      <div className="mx-auto flex w-full max-w-screen-xl items-center px-5 py-8 sm:py-12">
        <img
          alt="Hey Logo"
          className="mr-5 size-24 sm:mr-8 sm:size-36"
          src="/logo.png"
        />
        <div className="flex-1 space-y-1 tracking-tight sm:max-w-lg">
          <div className="text-2xl font-extrabold sm:text-5xl">
            Welcome to {APP_NAME},
          </div>
          <div className="ld-text-gray-500 text-2xl font-extrabold sm:text-5xl">
            the forefront of <Link href="https://medium.com/@HashBrown_Research/deso-the-future-of-web3-socialfi-1b38d7e1939d"><a target="_blank">DeSo</a></Link> innovation on Lens Protocol
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
```

This modification uses the `Link` component to wrap the `<a>` tag, ensuring that the link to an external site is handled correctly while maintaining the ability to open in a new tab (`target="_blank"`). For internal navigation within a Next.js application, you would omit `target="_blank"` and simply use the `Link` component to wrap the text or component representing the link.

## User:
