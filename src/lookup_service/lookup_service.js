const express = require('express');
const app = express();
var fs = require('fs');
var { spawn } = require("child_process");
var http = require('http');
var path = require('path');

var server = http.createServer(app);
var { Server } = require('socket.io');
var io = new Server(server, {maxHttpBufferSize: 1e8});

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

function search_client(name){
	for (var client of config.clients)
		if (client.name == name)
			return client;
	return undefined;
}

app.use('/static', express.static(path.join(__dirname, '/static')));
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));

app.get('/', (req, res) => {
	var content = fs.readFileSync("views/home.html", 'utf8')
	res.send(content);
});

app.get('/fhd', (req, res) => {
	var content = fs.readFileSync("views/fhd.html", 'utf8')
	res.send(content);
});

server.listen(config.lookup_port);
console.log("Starting api for lookup clients on: " + config.lookup_port);
jobs = {};

function kill_all_agent_jobs(agent_id){
	for (var job of jobs[agent_id])
		job.job.kill();
	jobs[agent_id] = [];
}

function port_busy(port) {
	for (var name in jobs) {
		for (var job of jobs[name]) {
			if (job.port == port)
				return true;
		}
	}
	return false;
}
function get_free_port() {
	var port = config.lookup_ports_start;
	while (port_busy(port)) port++;
	return port;
}
function prepare_job_cmd(cmd){
	console.log(cmd);
	var strarr = cmd.split(" ");
	var path = strarr.shift();
	console.log(strarr);
	return {
		"path": path,
		"options": strarr
	};
}
async function start_jobs_for_agent(socket, client, dims){
	var camera_port  = get_free_port();
	var camera_lookup_job = prepare_job_cmd(
		format(config.lookup_job, [
			client.upstream_server + client.upstream_path + "-cam",
			camera_port + "",
			dims.camera.w,
			dims.camera.h]));
	jobs[socket.id].push({
		"port": camera_port,
		"job": spawn(camera_lookup_job.path, camera_lookup_job.options)
	});

	var desktop_port = get_free_port();
	var desktop_lookup_job = prepare_job_cmd(
		format(config.lookup_job, [
			client.upstream_server + client.upstream_path + "-desktop",
			desktop_port + "",
			dims.desktop.w,
			dims.desktop.h]));
	console.log(desktop_lookup_job.path, desktop_lookup_job.options);
	jobs[socket.id].push({
		"port": desktop_port,
		"job": spawn(desktop_lookup_job.path, desktop_lookup_job.options)
	});

	await new Promise(resolve => setTimeout(resolve, 1000));

	socket.emit("lookup_ready", config.ip_addr_internal, desktop_port, camera_port, dims, client.name, client.detailed_name);
}

io.on('connection', (socket) => {
    console.log("New agent (" + socket.id + ") connected!");
    jobs[socket.id] = [];
    socket.on('disconnect', async () => {
		console.log("Agent: (" + socket.id + ") disconnected!");
		kill_all_agent_jobs(socket.id);
    });

    socket.on("reqest_config", async () => {
    	socket.emit("get_config", config.clients, config.default_lookup_dimensions);
	});

	socket.on("select_lookup", async (client_name, dims) => {
		kill_all_agent_jobs(socket.id);
		start_jobs_for_agent(socket, search_client(client_name), dims);
	});

});
