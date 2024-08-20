# Chat Transcript - Tab 1

## User:

About @init.sh :
Let's ask user to input its ETH address. So no need to hardcode it.

## AI (gpt-4-turbo-2024-04-09):

To modify the `init.sh` script to prompt the user for their Ethereum address instead of hardcoding it, you can use the `read` command in bash. Here's how you can update the script:

```shell:init.sh
#!/bin/bash

ln -sf ./.husky/pre-precommit .git/hooks/pre-precommit
ln -sf /usr/lib/01/git-meta/pre-commit .git/hooks/pre-commit
ln -sf /usr/bin/git-meta .git/hooks/git-meta

echo "Please enter your Ethereum address:"
read eth_address
echo "$eth_address" | save .git/hooks/.eth
```

This script will now prompt the user to input their Ethereum address, which will then be saved to `.git/hooks/.eth

## User:

Thank you, awesome!

## AI (gpt-4-turbo-2024-04-09):

You're welcome! If you have any more questions or need further assistance, feel free to ask. Happy coding!

## User:
