#!/bin/bash

ln -sf ./.husky/pre-precommit .git/hooks/pre-precommit
ln -sf /usr/lib/01/git-meta/pre-commit .git/hooks/pre-commit
ln -sf /usr/bin/git-meta .git/hooks/git-meta

echo "Please enter your Ethereum address:"
read eth_address
echo "$eth_address" | save .git/hooks/.eth