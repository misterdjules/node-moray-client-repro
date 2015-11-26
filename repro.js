var moray = require('moray');
var bunyan = require('bunyan');
var vasync = require('vasync');

var VMAPI_VMS_BUCKET_NAME = 'vmapi_vms';

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

    morayClient.on('connect', function onConnect() {
        console.log('moray client connected');
        return callback(null, morayClient);
    });

    morayClient.on('error', function onError(err) {
    	console.error('error:', err);
    });
}

vasync.waterfall([
	connectToMoray,
	function deleteNonExistingVms(morayClient, next) {
		morayClient.deleteMany(VMAPI_VMS_BUCKET_NAME,
			'(alias=non-existing-alias)',
            {noLimit: true},
            function onVmsDeleted(err) {
                return next(err, morayClient);
            });
	},
	function closeMorayConnection(morayClient, next) {
		console.log('closing moray connection');
		morayClient.close();
		return next();
	}
], function allDone(err) {
	if (err)
		console.error(err);
});
