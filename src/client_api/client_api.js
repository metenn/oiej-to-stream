import express from "express";
import fs from "node:fs";
const app = express();
/** @import {Client} from "../../types.d.ts" */

/** @type {typeof import("../../config.json")} */
const config = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

/**
 *
 * @param {string} s
 * @param {string[]} args
 * @returns {string}
 */
function format(s, args) {
    let result = s;
    for (const i of args) {
        result = result.replace("%s", i);
    }
    return result;
}

/**
 * Converts an "IPv4-mapped IPv6" address to an IPv4 address
 * e.g.
 * ::ffff:192.168.0.1 -> 192.168.0.1
 * Returns the source if passed an IPv4 string.
 * @param {string} ipv6 IPv6 Address
 * @returns {string} The mapped IPv4 address
 */
function ipv6_to_ip(ipv6) {
    if (ipv6.indexOf(":") != -1) {
        return ipv6.split(":").splice(-1)[0];
    } else {
        return ipv6;
    }
}

/**
 * Looks up client within the config file and returns relevant data
 * @param {string} ip
 * @returns {Client | undefined}
 */
function search_client(ip) {
    for (var client of config.clients)
        if (client.client_ip === ip) {
            return client;
        }
    return undefined;
}

// Middleware for logging and setting up necessary variables in the Request
// object
app.use((req, res, next) => {
    if (!req.ip) {
        console.warn(`Request ${req.url} BROKEN REQUEST (No IP)`);
        res.status(400).send("Broken request (No IP)");
        return;
    }
    req.ip2 = ipv6_to_ip(req.ip);
    req.client = search_client(req.ip2);
    console.log(
        `Request ${req.url} from ${req.ip2} [${
            req.client ? req.client.name : "no such client"
        }]`
    );
    next();
});

app.get("/check", (req, res) => {
    if (!req.client) {
        res.send("NO");
    } else {
        res.send("YES");
    }
});

app.get("/desktop", (req, res) => {
    const client = req.client;
    if (!client) {
        res.status(401).send(`No client ${req.ip2} in config.json\n`);
        return;
    }
    res.send(
        format(config.client_ffmpeg_destkop_options, [
            client.upstream_server,
            client.upstream_path,
        ])
    );
    return;
});

app.get("/cam", (req, res) => {
    const client = req.client;
    if (!client) {
        res.status(401).send(`No client ${req.ip2} in config.json\n`);
        return;
    }
    res.send(
        format(config.client_ffmpeg_cam_options, [
            client.upstream_server,
            client.upstream_path,
        ])
    );
});

app.get("/desktop-quick-view-check", (req, res) => {
    const client = req.client;
    if (client && config.enable_desktop_quick_view) {
        res.send("YES");
    } else {
        res.send("NO");
    }
});

app.get("/cam-quick-view-check", (req, res) => {
    if (req.client && config.enable_cam_quick_view) {
        res.send("YES");
    } else {
        res.send("NO");
    }
});

app.get("/desktop-quick-view", (req, res) => {
    const client = req.client;
    if (!client) {
        res.status(401).send(`No client ${req.ip2} in config.json\n`);
        return;
    }
    res.send(
        format(config.client_ffmpeg_destkop_qv_options, [
            client.upstream_server,
            client.upstream_path,
        ])
    );
    return;
});

app.get("/cam-quick-view", (req, res) => {
    const client = req.client;
    if (!client) {
        res.status(401).send(`No client ${req.ip2} in config.json\n`);
        return;
    }
    res.send(
        format(config.client_ffmpeg_cam_qv_options, [
            client.upstream_server,
            client.upstream_path,
        ])
    );
    return;
});

app.listen(config.client_api_port, () => {
    console.log(`Starting api for clients on: ${config.client_api_port}`);
});
