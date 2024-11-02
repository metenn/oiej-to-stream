#!/bin/bash
if [ ! -e content/mediamtx ] || [ ! -e content/mediamtx.yml ] || [ ! -e content/mediamtx.service ]; then
	echo "Please create directory ./content with files:"
	echo "    * mediamtx"
	echo "    * mediamtx.yml"
	echo "    * mediamtx.service"
	exit 1
fi


IP=$(cat ../../config.json | jq -r '.ip_addr_internal')
PORT=$(cat ../../config.json | jq -r '.client_api_port')

echo "Ip addr and port read from config: $IP:$PORT"

for script in desktop desktop-quick-view cam cam-quick-view
do
	echo "Generating ${script}.sh"
	cat templates/${script}.sh | sed -s "s#@@SERVERIP@@#${IP}#g" | sed -s "s#@@APIPORT@@#${PORT}#g" > content/${script}.sh
done

for script in desktop desktop-quick-view cam cam-quick-view
do
	echo "Copying ${script}.service"
	cp templates/${script}.service content/${script}.service
done

for script in desktop desktop-quick-view cam cam-quick-view
do
	echo "Chmoding ${script}.sh"
	chmod +x content/${script}.sh
done

echo "Copying xhost + unit"
cp templates/xhost.desktop content/xhost.desktop

echo "Packing tarball"
(cd content && tar -cf oiej-to-stream.tar mediamtx* *service *desktop *sh && mv oiej-to-stream.tar ../)

echo "Tarball content"
tar -tvf oiej-to-stream.tar
