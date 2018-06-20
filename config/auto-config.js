const {exec} = require('child_process');

exec('npm run auto-config-db', function(error, stdout, stderr) {
  if (error) {
    console.error('error: ' + error);
    return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + typeof stderr);

});

console.log("run 'mongo -port 3002' to connect to db");
