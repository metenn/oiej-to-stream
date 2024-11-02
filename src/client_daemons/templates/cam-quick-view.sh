#!/bin/bash
set -e
set -o pipefail

# TODO properly find usb camera

check=$(curl @@SERVERIP@@:@@APIPORT@@/cam-quick-view-check)
if [ "$check" == "NO" ]; then
	exit 0
fi

if [ "$check" == "YES" ]; then

	ffmpeg_config=$(curl @@SERVERIP@@:@@APIPORT@@/cam-quick-view)
	ffmpeg -i /dev/video0 $ffmpeg_config

	exit 0
else
	echo "Check value is not one of YES/NO!"
	exit 1
fi
