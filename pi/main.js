const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express');

const app = express();

const port = 80;
const cmd_template = 'echo "_cmd_" | cec-client RPI -s -d 1';

let deviceStates = {
    TV: false
}

function getDeviceStates(){

}

async function runCmd(command) {
    command = cmd_template.replace("_cmd_", command);
    const { stdout, stderr } = await exec(command);
    return stdout;
}

app.get('/', (req, res) => {
    res.send("Tunnel läuft");
});

app.get('/smarthome/tv/:state', (req, res) => {
    if (req.params.state == 1){
        if (!deviceStates.TV){
            runCmd("on 0");
            deviceStates.TV = true;
            console.log('Command "on 0" sent to TV');
            res.end('Command "on 0" sent to TV');
        }
    } else {
        if (deviceStates.TV){
            runCmd("standby 0");
            deviceStates.TV = false;
            console.log('Command "standby 0" sent to TV');
            res.end('Command "standby 0" sent to TV');
        }
    }
});

app.listen(port, () => {
    console.log('Server läuft auf port', port);
});