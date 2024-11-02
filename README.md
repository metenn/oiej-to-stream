## Oiej to Stream

## Components:

### Lookuper

Allows to pass arbitrary RTSP stream through web socket.
Details can be found in: `src/lookuper/README.md`

### Client_api

Client api informs clients about:
* almost all `ffmpeg` options and parameters,
* upstream server ip and port,
* if quick views should be used.
Details can be found in: `src/client_api/README.md`

### Client_daemons

Client daemons contains templates of scripts and daemon services that should be deployed on clients computers.
Details can be found in: `src/client_daemons/README.md`

## Todo list:

- [x] Generic script that installs screen and camera caputre daemon on computers (remember about Xauthority)
- [x] Forwarder RTSP to websocket
- [x] Forwarder RTSP to OBS
- [ ] Selector for RTSP lookup nad forward
- [ ] Json format for multiple sources
- [x] API for computers that informs about master RTSP servers 
- [ ] Selected team text generator
- [ ] News label overlay generator
- [ ] Manager for news label pool


#### Note

Author is aware that this repo contains packages installed with `npm install` and did it intentionally (although he shouldn't).
