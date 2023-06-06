#!/bin/bash

set -e

git config user.name github-actions[bot]
git config user.email github-actions[bot]@users.noreply.github.com

git checkout uat

git merge --no-edit --no-ff main
git push origin uat

git checkout main
git rebase uat
git push origin main
