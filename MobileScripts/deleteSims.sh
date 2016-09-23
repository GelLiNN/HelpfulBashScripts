xcrun simctl list devices | grep -v '^[-=]' | cut -d "(" -f2 | cut -d ")" -f1 | xargs -I {} xcrun simctl delete "{}"
> GUIDS.txt
killall "iOS Simulator"