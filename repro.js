var moray = require('moray');
var bunyan = require('bunyan');
var vasync = require('vasync');

function connectToMoray(callback) {
    var MORAY_CLIENT_CONFIG = {
        host: process.env.MORAY_IP || '10.99.99.17',
        port: 2020,
        log: bunyan.createLogger({
            name: 'moray_client',
            level: 'debug',
            stream: process.stdout
        }),
        maxConnections: process.env.MAX_CONNECTIONS === undefined ?
            undefined : +process.env.MAX_CONNECTIONS
    };

    console.log('Connecting to moray...');
    var morayClient = moray.createClient(MORAY_CLIENT_CONFIG);

    morayClient.once('connect', function onConnect() {
        console.log('Moray client connected!');
        return callback(null, morayClient);
    });

    morayClient.on('error', function onError(err) {
        console.error('error:', err);
        return callback(err);
    });
}

function closeMorayConnection(morayClient, callback) {
    morayClient.on('close', function() {
      console.log('Moray client connection closed!');
      return callback();
    });

    console.log('Closing moray connection...');
    morayClient.close();
}

vasync.waterfall([
    connectToMoray,
    closeMorayConnection
], function allDone(err) {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('All done!');
    }
});
