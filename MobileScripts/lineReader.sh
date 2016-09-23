#!/bin/bash
while IFS='' read -r line || [[ -n "$line" ]]; do
    echo "iPhone 6 simulator GUID: $line"
	open -n /Applications/Xcode.app/Contents/Developer/Applications/iOS\ Simulator.app/ --args -CurrentDeviceUDID "$line"
	sleep 8
	xcrun simctl launch "$line" com.splunk.datasender
done < "$1"