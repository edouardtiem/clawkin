#!/bin/bash
# Test statusline Clawkin — emblème K3 (lowercase k)
# Sprite emblème fixe : ⡧⡂

DIM='\033[38;5;240m'
RESET='\033[0m'

# Format 1 ligne, sprite à GAUCHE :
echo -e "⡧⡂ ${DIM}#001 Mole · L247 · 12w · 35% ctx${RESET}"
