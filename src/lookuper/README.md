#### Lookuper

Allows to pass RTSP stream through websocket.

Usage:

```
Usage: node lookup.js <rtsp_path> <websocket_port> <width> <height> <bitrate>
```

Example:

```
node lookup.js rtsp://localhost:8554/desktop 9999 720 480 2000K
```

File `index.html` contains example website that listen to streams on `localhost:9999`

It uses: https://github.com/kyriesent/node-rtsp-stream

Notes / todo:
* index.html does not recognize width and height automatically,
* index.html is not restarting connection on failure.

