#!/bin/bash
set -e
set -o pipefail

export DISPLAY=:0
dims=$(xrandr | grep \* | cut -d ' ' -f 4)

check=$(curl @@SERVERIP@@:@@APIPORT@@/check)
if [ "$check" == "NO" ]; then
	exit 0
fi

if [ "$check" == "YES" ]; then

	ffmpeg_config=$(curl @@SERVERIP@@:@@APIPORT@@/desktop)
	ffmpeg -f x11grab -s $dims $ffmpeg_config

	exit 0
else
	echo "Check value is not one of YES/NO!"
	exit 1
fi

