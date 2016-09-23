#!/bin/bash
i=1
while read -r line; do
	 	test $i -eq 1 && ((i=i+1)) && continue
		serial="$(echo "$line" | cut -d$'\t' -f1)"
		/Users/knealy/Library/Developer/Xamarin/android-sdk-macosx/platform-tools/adb -s "$serial" install /Users/knealy/XProjects/DataSender/Droid/com.splunk.datasender.apk &
		sleep 10
		/Users/knealy/Library/Developer/Xamarin/android-sdk-macosx/platform-tools/adb -s "$serial" shell monkey -p com.splunk.datasender -c android.intent.category.LAUNCHER 1 &
done < "SERIALS.txt"