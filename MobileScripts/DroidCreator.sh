#!/bin/bash
for i in {1..5}
do
	/Users/knealy/Library/Developer/Xamarin/android-sdk-macosx/tools/android create avd -n droid_$i -t 22 --abi google_apis/armeabi-v7a -s QVGA &
	sleep 5
	/Users/knealy/Library/Developer/Xamarin/android-sdk-macosx/tools/emulator -avd droid_$i &
	sleep 5
done
/Users/knealy/Library/Developer/Xamarin/android-sdk-macosx/platform-tools/adb devices >> SERIALS.txt
