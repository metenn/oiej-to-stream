### Client_api

Client api informs clients about:
* almost all `ffmpeg` options and parameters,
* upstream server ip and port,
* if quick views should be used.

Usage:
```
node client_api.js <path_to_config_file>
```

Api provides clients with almost all ffmpeg options (including upstream server ip and port), as well as information whether they should start uploading stream.
It detects clients from their ip address.
