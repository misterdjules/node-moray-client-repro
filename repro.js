var moray = require('moray');
var bunyan = require('bunyan');
var vasync = require('vasync');

function connectToMoray(callback) {
    var MORAY_CLIENT_CONFIG = {
        host: process.env.MORAY_IP || '10.99.99.17',
        port: 2020,
        log: new bunyan({
            name: 'moray',
            level: 'info',
            serializers: bunyan.stdSerializers
        }),
        connectTimeout: process.env.CONNECT_TIMEOUT === undefined ?
        	undefined : +process.env.CONNECT_TIMEOUT
    };

    var morayClient = moray.createClient(MORAY_CLIENT_CONFIG);

    morayClient.once('connect', function onConnect() {
        console.log('moray client connected!');
        return callback(null, morayClient);
    });

    morayClient.on('error', function onError(err) {
    	console.error('error:', err);
    });
}

function closeMorayConnection(morayClient, callback) {
	console.log('closing moray connection...');
	morayClient.close();
	return callback();
}

vasync.waterfall([
	connectToMoray,
	closeMorayConnection
], function allDone(err) {
	if (err)
		console.error(err);
});
