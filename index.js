import express from 'express';
import { spawn } from 'child_process';

const app = express();
const PORT = 8282;

app.get( '/script1', ( req, res ) => {

    let data1;

    // Spawn new child process to call the python script
    const python = spawn( 'python3', ['script1.py'] );

    // Collect data from python Script
    python.stdout.on( 'data', ( data ) => {
        console.log('Pipe data from python script');
        data1 = data.toString();
    });

    // In close event we are sure that stream from child process is closed
    python.on( 'close', ( code ) => {
        console.log(`Child process close all stdio with code ${ code }`);
        // send data to browser
        res.send( data1 );
    });

});


app.get( '/script2/:fname/:lname', ( req, res ) => {
    let data2;

    // Spawn new child process to call the second python script
    const python = spawn( 'python3', [ 'script2.py', req.params.fname, req.params.lname ] ); // send request url params to argument to python script2

    // Collect Data from Script2
    python.stdout.on( 'data', ( data ) => {
        console.log('Pipe data from script...');
        data2 = data.toString();
    });

    // In close event we are sure that stream from child process is closed
    python.on( 'close', ( code ) => {
        console.log(`Child process close all stdio with the code ${ code }`);
        // Send Data to Browser
        res.send( data2 );
    });
});


app.listen( PORT, () => {
    console.log( `APP listeninf on port : ${ PORT }`);
});