### Client_daemons

Client daemons contains templates of scripts and daemon services that should be deployed on clients computers.

List of daemons:
* mediamtx -- rtsp and other stream standards server,
* desktop -- streams client desktop,
* cam -- streams client camera,
* desktop-quick-view -- streams client desktop with smaller bitrate,
* cam-quick-view -- streams client camera with smaller bitrate.

Usage: `./prepare_tarball.sh` script takes no arguments and fills templates with informations from `config.json` and prepares tarball that contains all necessary files.

Usage: `./install.sh` deploys tarball generated with `./prepare_tarball.sh` on client computer.

