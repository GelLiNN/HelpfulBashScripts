#!/bin/bash
for i in {1..10}
do
	xcrun simctl create "iossimulator $i" "iPhone 6" "com.apple.CoreSimulator.SimRuntime.iOS-8-4" >> GUIDS.txt
done
chmod +x lineReader.sh
./lineReader.sh GUIDS.txt