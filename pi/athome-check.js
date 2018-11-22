const noble = require('noble');

noble.on('stateChange', state => {
    console.log(state);
});