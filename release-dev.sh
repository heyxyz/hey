#!/bin/bash

set -e

git config user.name github-actions[bot]
git config user.email github-actions[bot]@users.noreply.github.com

git checkout develop

git merge --no-edit --no-ff main
git push origin develop

git checkout main
git rebase develop
git push origin main
