#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = 3333;
const cmd_template = 'echo "_cmd_" | cec-client RPI -s -d 1';

const api_key = "TwM674du14VuP5IrfvmKP2rCryTIb2L6";

let deviceStates = {
    TV: 'standby'
}

async function getDeviceStates() {
    let command = cmd_template.replace("_cmd_", "pow 0");
    console.log("Device State Command:", command);
    try {
        const {
            stdout,
            stderr
        } = await exec(command);
        if (stdout.includes('power status: standby')) {
            deviceStates.TV = 'standby';
            console.log("Device status set to standby");
        } else if (stdout.includes('power status: on')) {
            deviceStates.TV = 'on';
            console.log("Device status set to on");
        } else {
            deviceStates.TV = 'unknown';
            console.log("Device status set to unknown");
        }
    } catch (error) {
        console.log("Error while getting device states:", error);
    }
}

async function runCmd(command) {
    command = cmd_template.replace("_cmd_", command);
    try {
        const {
            stdout,
            stderr
        } = await exec(command);
    } catch (error) {
        console.log("Error while running command:", error);
    }
}

app.get('/', (req, res) => {
    console.log('Called "/"');
    res.send("Tunnel läuft");
});

app.get('/smarthome/tv', (req, res) => {
    res.send("TV Status: " + deviceStates.TV);
});

app.post('/smarthome/tv', (req, res) => {
    if (req.body.apiKey === api_key) {
        console.log("TV request...");
        console.log(deviceStates);
        if (deviceStates.TV === 'standby') {
            console.log("Trying to switch on TV");
            runCmd("on 0");
            deviceStates.TV = 'on';
            res.send('TV turned on');
        } else if (deviceStates.TV === 'on') {
            runCmd("standby 0");
            deviceStates.TV = 'standby';
            res.send('TV turned off');
        }
    } else {
        res.send("Authentication failed, wrong key bitch");
    }
});

app.listen(port, () => {
    console.log('Server läuft auf port', port);
    getDeviceStates();
});