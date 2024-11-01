
Stream = require('node-rtsp-stream');

function format(s, args){
	result = s;
	for (i of args){
		result = result.replace("%s", i);
	}
	return result;
}
async function main(){
	if (process.argv.length != 7){
		console.log(format("Usage: %s %s <rtsp_path> <websocket_port> <width> <height> <bitrate>", [process.argv[0], process.argv[1]]));
		process.exit(1);
	}
	stream = new Stream({
		streamUrl: process.argv[2],
		wsPort: Number(process.argv[3]),
		width: Number(process.argv[4]),
		height: Number(process.argv[5]),
		ffmpegOptions: {
			'-video_size': format('%sx%s', [process.argv[4], process.argv[5]]),
			'-s': format('%sx%s', [process.argv[4], process.argv[5]]),
			'-b': process.argv[6]
		}
	});
}

main()
