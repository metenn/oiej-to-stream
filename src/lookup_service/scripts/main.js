socket = io();
var clients, default_lookup_dimensions, selected_client_name = "";

function calculate_lookup_dims(general_w){

	general_w -= 30;
	camera_w = default_lookup_dimensions.camera.w;
	camera_h = default_lookup_dimensions.camera.h;
	desktop_w = default_lookup_dimensions.desktop.w;
	desktop_h = default_lookup_dimensions.desktop.h;

	scale = general_w / (desktop_w + camera_w);

	console.log(scale);
	console.log(desktop_w);
	console.log(desktop_h);
	console.log(camera_w);
	console.log(camera_h);

	return {
		"camera":  { "w": Math.floor(camera_w * scale),  "h": Math.floor(camera_h * scale) },
		"desktop": { "w": Math.floor(desktop_w * scale), "h": Math.floor(desktop_h * scale) }
	};
}

function select_lookup(name){
	name = name.replaceAll("SEPARATOR", " ");
	selected_client_name = name;
	document.getElementById("selected-name").innerHTML = "Oiej to Stream<br>Loading lookup for team: " + name;

	console.log(calculate_lookup_dims(window.innerWidth));

	socket.emit("select_lookup", name, calculate_lookup_dims(window.innerWidth));
	redraw_buttons();
}

function change_full_name(full_name){
	document.getElementById("full-name").innerHTML = full_name;
}
function redraw_buttons(){
	var buttons_html = "";
	for (var client of clients) {
		var style = "", button_html = "", active = "", div_events = "", btn_events = "";

		if (client.name == selected_client_name)
			active = "-active";
		else
			active = "-not-active";

		style += "grid-row-start: "    + client.x_position + ";";
		style += "grid-row-end: "      + client.x_position + ";";
		style += "grid-column-start: " + client.y_position + ";";
		style += "grid-column-start: " + client.y_position + ";";

		div_events +=  'onmouseover=';
		div_events += 'change_full_name("' + client.detailed_name.replaceAll(" ", "&nbsp;") + '") ';
		div_events +=  'onmouseout=';
		div_events += 'change_full_name("") ';
		btn_events += 'onclick='
		btn_events += 'select_lookup("' + client.name.replaceAll(" ", "SEPARATOR") + '") ';

		button_html += '<div class="grid-item" style=" ' + style + '" '+ div_events + '>';
		button_html += '<button class="grid-button' + active + '" ' + btn_events + '>';
		button_html += client.name;
		button_html += '</button>';
		button_html += '</div>';

		buttons_html += button_html;
	}
	document.getElementById("grid-plane").innerHTML = buttons_html;
}

socket.emit("reqest_config");
socket.on("get_config", (_clients, _default_lookup_dimensions) => {
	clients = _clients;
	default_lookup_dimensions = _default_lookup_dimensions;
	console.log("Got clients list:");
	console.log(clients);
	console.log(default_lookup_dimensions);
	redraw_buttons();
});

socket.on("lookup_ready", (ip_addr, desktop_port, camera_port, dims, name, full_name) => {
	document.getElementById("selected-name").innerHTML = "Oiej to Stream<br>" + name + " (" + full_name + ")";
	document.getElementById("desktop-box").innerHTML =
		'<canvas id="desktop-canvas" width="' +
		dims.desktop.w +
		'" height="' +
		dims.desktop.h +
		'"> </canvas>';

	document.getElementById("camera-box").innerHTML =
		'<canvas id="camera-canvas" width="' +
		dims.camera.w +
		'" height="' +
		dims.camera.h +
		'"> </canvas>';

	var canvas_desktop = document.getElementById('desktop-canvas');
	var websocket_desktop = new WebSocket('ws://' + ip_addr + ':' + desktop_port);
	var player_desktop = new jsmpeg(websocket_desktop, {canvas:canvas_desktop, autoplay:true, loop:true})

	var canvas_camera = document.getElementById('camera-canvas');
	var websocket_camera = new WebSocket('ws://' + ip_addr + ':' + camera_port);
	var player_camera = new jsmpeg(websocket_camera, {canvas:canvas_camera, autoplay:true, loop:true})

});
