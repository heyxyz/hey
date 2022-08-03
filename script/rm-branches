#!/bin/bash

echo "Removing branches 🗑"
git fetch -p && git branch --merged | grep -v '*' | grep -v 'master' | xargs git branch -d
echo "Removing branches completed 🎉"
