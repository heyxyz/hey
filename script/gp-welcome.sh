#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'
BOLD=$(tput bold)
NORMAL=$(tput sgr0)
URL=$(eval gp url 4783)

clear
curl -s "$URL/" > /dev/null
echo -e "✅ ${GREEN}${BOLD}Lenster client warmed up${NORMAL}${NC} 🔥"
echo -e "\n👋 ${GREEN}${BOLD}Welcome to Lenster${NORMAL}${NC}\n"
echo -e "💻 ${BOLD}Commands:${NORMAL}\n"
awk -F':' '{printf "%s%s", $2, (/^Description/)?"\n":" -"}' ./script/commands.txt
echo -e "\n\nVisit: ${BLUE}${URL}${NC}\n\n"
echo -e "${PURPLE}${BOLD}Happy coding${NORMAL}${NC} 😍\n"
