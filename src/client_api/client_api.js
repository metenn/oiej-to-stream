const express = require('express')
const app = express()
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

function format(s, args){
	result = s;
	for (i of args){
		result = result.replace("%s", i);
	}
	return result;
}

function ipv6_to_ip(ipv6){
	if (ipv6.indexOf(":") != -1) {
		var res = ipv6.split(":").splice(-1);
		if (typeof(res) == 'string')	return res;
		else							return res[0];
	} else {
		return ipv6;
	}
}

function search_client(ip){
	for (var client of config.clients)
		if (client.client_ip == ip)
			return client;
	return undefined;
}

app.get('/check', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	if (!client)    return res.send("NO");
	else            return res.send("YES");
});

app.get('/desktop', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	console.log(format("Request desktop from %s [%s]", [ipv6_to_ip(req.ip), client ? client.name : "no such client"]));
	if (!client)
		return res.send(format("No client %s in config.json\n", [ipv6_to_ip(req.ip)]));
	return res.send(format(config.client_ffmpeg_destkop_options, [client.upstream_server, client.upstream_path]));
});

app.get('/cam', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	console.log(format("Request cam from %s [%s]", [ipv6_to_ip(req.ip), client ? client.name : "no such client"]));
	if (!client)
		return res.send(format("No client %s in config.json\n", [ipv6_to_ip(req.ip)]));
	return res.send(format(config.client_ffmpeg_cam_options, [client.upstream_server, client.upstream_path]));
});

app.get('/desktop-quick-view-check', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	console.log(format("Request desktop-quick-view-check from %s [%s]", [ipv6_to_ip(req.ip), client ? client.name : "no such client"]));
	if (client && config.enable_desktop_quick_view)
		return res.send("YES");
	else
		return res.send("NO");
});

app.get('/cam-quick-view-check', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	console.log(format("Request cam-quick-view-check from %s [%s]", [ipv6_to_ip(req.ip), client ? client.name : "no such client"]));
	if (client && config.enable_cam_quick_view)
		return res.send("YES");
	else
		return res.send("NO");
});

app.get('/desktop-quick-view', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	console.log(format("Request desktop-quick-view from %s [%s]", [ipv6_to_ip(req.ip), client ? client.name : "no such client"]));
	if (!client)
		return res.send(format("No client %s in config.json\n", [ipv6_to_ip(req.ip)]));
	return res.send(format(config.client_ffmpeg_destkop_qv_options, [client.upstream_server, client.upstream_path]));
});

app.get('/cam-quick-view', (req, res) => {
	client = search_client(ipv6_to_ip(req.ip));
	console.log(format("Request cam-quick-view from %s [%s]", [ipv6_to_ip(req.ip), client ? client.name : "no such client"]));
	if (!client)
		return res.send(format("No client %s in config.json\n", [ipv6_to_ip(req.ip)]));
	return res.send(format(config.client_ffmpeg_cam_qv_options, [client.upstream_server, client.upstream_path]));
});

app.listen(config.client_api_port, () => {
	console.log("Starting api for clients on: " + config.client_api_port);
});
