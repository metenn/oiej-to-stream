#!/bin/bash
cd /root
rm -f /root/oiej-to-stream
mkdir oiej-to-stream
cd oiej-to-stream
cp ../oiej-to-stream.tar .
tar -xf oiej-to-stream.tar

chmod +x *.sh

mkdir -p /etc/xdg/autostart/
cp xhost.desktop /etc/xdg/autostart/xhost.desktop

for service in desktop desktop-quick-view cam cam-quick-view mediamtx
do
	cp ${service}.service /etc/systemd/system/${service}.service
done

systemctl daemon-reload

for service in desktop desktop-quick-view cam cam-quick-view mediamtx
do
	systemctl enable ${service}.service
	systemctl start ${service}.service
done
