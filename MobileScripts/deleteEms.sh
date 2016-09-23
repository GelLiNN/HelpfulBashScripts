> SERIALS.txt
for i in {1..5}
do
	/Users/knealy/Library/Developer/Xamarin/android-sdk-macosx/tools/android delete avd -n droid_$i &
done
killall "emulator64-arm"