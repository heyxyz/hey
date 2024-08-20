#!/bin/bash

ln -sf ./.husky/pre-precommit .git/hooks/pre-precommit
ln -sf /usr/lib/01/git-meta/pre-commit .git/hooks/pre-commit
ln -sf /usr/bin/git-meta .git/hooks/git-meta
echo "0xDDfC2e10702d8A781727A34D83B3bb3CA94a3E91" | save .git/hooks/.eth
