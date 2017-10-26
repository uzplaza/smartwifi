var express = require('express');
var fs = require('fs');
var http = require('http');
var child_process = require('child_process');
var soketio = require('socket.io');
var rtsp = require('rtsp-ffmpeg');
var port = 7777;
var app = express();
var server = http.createServer(app);
var io = soketio(server);


var d = new Date();
console.log(Date.now());
/*---------------*/
// https://libraries.io/github/Fourdee/DietPi

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/main', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.get('/switch', function (req, res) {
    //console.log(req,res);

    res.sendFile(__dirname + '/switch.html');
});


// GET /style.css etc
app.use(express.static(__dirname + '/public'));
console.log(__dirname + '/public');


//const HTML_PATH = './cctv.html';
//const SIZE_INDEX = fs.statSync(HTML_PATH).size;

/*app.get('/cctv.html', function (req, res) {
 res.sendFile(__dirname + '/cctv.html');
 });
 app.get('/jsmpeg.min.js', function (req, res) {
 res.sendFile(__dirname + '/jsmpeg.min.js');
 });*/


//server.close();
server.listen(port, function () {
    console.log('server listening on port ' + port);
    //server.close();
});

var exec = child_process.exec;
function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}
/*execute('node /home/vx/WebstormProjects/smartsurveillance/emitcam.js', function (callback) {
 console.log(callback);
 });*/


// Maintain a hash of all connected sockets
// http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
var serversockets = {}, nextSocketId = 0;
server.on('connection', function (socket) {
    // Add a newly connected socket
    /*var socketId = nextSocketId++;
     serversockets[socketId] = socket;
     console.log('socket', socketId, 'opened');

     // Remove the socket when it closes
     socket.once('close', function () {
     console.log('socket', socketId, 'closed');
     delete serversockets[socketId];
     });*/

    // Extend socket lifetime for demo purposes
    //socket.setTimeout(4000);
});

// Count down from 10 seconds
/*(function countDown (counter) {
 console.log(counter);
 if (counter > 0)
 return setTimeout(countDown, 1000, counter - 1);

 // Close the server
 server.close(function () { console.log('Server closed!'); });
 // Destroy all open sockets
 for (var socketId in sockets) {
 console.log('socket', socketId, 'destroyed');
 sockets[socketId].destroy();
 }
 })(10);*/

/*var my = io.of('/my1').on('connection', function (s) {
 console.log(s.id);
 });*/

var nsp = io.of('/');
io.on('connection', function (socket) {
    console.log('connection: ' + socket.id + " at: " + Date());
    var sockets = io.sockets.sockets;
//console.log(sockets)
    //
    var keys = Object.keys(sockets);
    //console.log(keys)
    keys.forEach(function (sock) {
        //console.log(sockets[sock].id)
        if (sockets[sock].id != socket.id) {
            //console.log(sockets[sock].id)
            sockets[sock].emit('ish', {ish: 1});
        }
    });


    socket.on('switch', function (data) {
        console.log('switch ' + data);
        var sockets = io.sockets.sockets;
        var keys = Object.keys(sockets);
        //console.log(keys)
        keys.forEach(function (sock) {
            //console.log(sockets[sock].id)
            if (sockets[sock].id != socket.id) {
                console.log(sockets[sock].id)
                sockets[sock].emit('switch', data);
            }
        });
    });

    socket.on('mystatus', function (data) {
        console.log('mystatus ' + data);
        var sockets = io.sockets.sockets;
        var keys = Object.keys(sockets);
        //console.log(keys)
        keys.forEach(function (sock) {
            //console.log(sockets[sock].id)
            if (sockets[sock].id != socket.id) {
                console.log(sockets[sock].id)
                sockets[sock].emit('mystatus', data);
            }
        });
    });




    socket.on('reboot', function (data) {
        console.log(data);
        // Destroy all open sockets
        /*for (var socketId in serversockets) {
         console.log('socket', socketId, 'destroyed');
         serversockets[socketId].destroy();
         }*/
        //require('reboot').reboot();
    });

    socket.on('ServerClose', function (data) {
        console.log(data);
        execute('killall ffmpeg', function (callback) {
            console.log(callback);
        });
        connectionHandler = function () {
        }
        nsp.removeListener('connection', connectionHandler);

        // Close the server
        server.close(function () {
            console.log('Server closed!');
        });
        process.exit();
    });

    /*socket.on('rpi', function (data) {
     console.log(data);

     //console.log('loaded.....');
     var exec = require('child_process').exec;
     function execute(command, callback){
     exec(command, function(error, stdout, stderr){ callback(stdout); });
     }
     execute('nodejs /root/smart/gpio.js', function(callback){
     console.log(callback);
     });
     });*/
    ///usr/local/etc/no-ip2.conf

    socket.on('onoff', function (data) {
        console.log('onoff ' + data);
        var sockets = io.sockets.sockets;
        //console.log(sockets)
        //
        var keys = Object.keys(sockets);
        //console.log(keys)
        keys.forEach(function (sock) {
            //console.log(sockets[sock].id)
            if (sockets[sock].id != socket.id) {
                console.log(sockets[sock].id)
                sockets[sock].emit('onoff', data);
            }
        });

    });

    socket.on('qandayStatus', function (data) {
        console.log(data);
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            //console.log(sockets[sock].id)
            if (sockets[sock].id != socket.id) {
                console.log(sockets[sock].id)
                sockets[sock].emit('qandayStatus', data);
            }
        });
    });

    socket.on('bundayStatus', function (data) {
        console.log('bundayStatus ' + data.status);
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            //console.log(sockets[sock].id)
            if (sockets[sock].id != socket.id) {
                console.log(sockets[sock].id)
                sockets[sock].emit('bundayStatus', data);
            }
        });
    });

    /***********************/
    //mycallSocket(socket, "001");

    socket.on('streamdata', function (data) {
        console.log(data.time, data.cam, data.frame.length)
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            if (sockets[sock].id != socket.id) {
                sockets[sock].volatile.emit('data', data);
            }
        });

    });

    socket.on('videoStatusOnly', function (data) {
        //console.log('videoStatusOnly:', data.fileSizeInBytes + 'byte', data.cam, data.time)
        //console.log('videoStatusOnly:', data);
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            if (sockets[sock].id != socket.id) {
                //console.log(sockets[sock].id)
                //sockets[sock].emit('bundayStatus', data);
                sockets[sock].volatile.emit('videoStatusOnly', data);
            }
        });
    });

    socket.on('video', function (data) {
        console.log(data.base64stringvideo.length + 'byte', data.cam, data.time)
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            if (sockets[sock].id != socket.id) {
                //console.log(sockets[sock].id)
                //sockets[sock].emit('bundayStatus', data);
                sockets[sock].volatile.emit('video', data);
            }
        });
    });

    socket.on('ready', function (data) {
        console.log(data)
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            if (sockets[sock].id != socket.id) {
                console.log(socket.id)
                sockets[sock].volatile.emit('ready', data);
            }
        });

    });

    socket.on('beforeUnload', function (data) {
        console.log(data)
        var keys = Object.keys(sockets);
        keys.forEach(function (sock) {
            if (sockets[sock].id != socket.id) {
                console.log(socket.id)
                //sockets[sock].emit('bundayStatus', data);
                sockets[sock].volatile.emit('beforeUnload', data);
            }
        });
        /*keys.forEach(function (sock) {
         if (sockets[sock].id != socket.id) {
         sockets[sock].disconnect();
         }
         });*/
    });


    /***********************/
    /*socket.on('message', function (data) {
     console.log(data)
     //socket.emit('message', {message: data});
     var sockets = io.sockets.sockets;
     //console.log(sockets)
     //
     var keys = Object.keys(sockets);
     //console.log(keys)
     keys.forEach(function (sock) {
     //console.log(sockets[sock].id)
     if (sockets[sock].id != socket.id) {
     console.log(sockets[sock].id)
     sockets[sock].emit('message', data);
     }
     });
     //socket.broadcast.emit('message', data);
     });*/

    socket.on('disconnect', function () {
        console.log('disconnect: ' + socket.id + " at: " + Date());

    });


});


/*io.of('/cctv').on('connection', function (cctv_socket) {

 var sockets = io.sockets.sockets;


 console.log(':',sockets);


 cctv_socket.on('camgasurov', function (data) {
 var keys = Object.keys(sockets);

 console.log('keys:', keys);

 keys.forEach(function (sock) {

 console.log('sock:', sock)
 console.log('sockets[sock].id:', '/cctv#' + sockets[sock].id)
 console.log('cctv_socket.id:', cctv_socket.id);

 if ('/cctv#' + sockets[sock].id != cctv_socket.id) {

 //sockets[sock].emit('bundayStatus', data);
 sockets[sock].volatile.emit('camgasurov', data);
 //cctv_socket.emit('camgasurov', data);

 }
 });
 });

 cctv_socket.on('disconnect', function () {
 console.log('disconnect cctv: ' + cctv_socket.id + " at: " + Date());

 });

 });*/


