#!/bin/bash

hdiutil create -megabytes 100 -fs HFS+ -volname Day7 day7.dmg
hdiutil attach day7.dmg

# find /Volumes/Day7 -type d > dirs.txt
# cat dirs.txt | xargs -I %% -L 1 ./findandsum.sh %% > sizes.txt
# Open sizes.txt in Excel
# Prosper