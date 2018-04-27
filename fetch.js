var dir='/home/rafaelmarinhoa/RALB;
var access = fs.createWriteStream(dir + '/logfile.log', { flags: 'a' })
, error = fs.createWriteStream(dir + '/errorlog.log', { flags: 'a' });

proc.stdout.pipe(access);
proc.stderr.pipe(error);

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "web",
  password: "3nJH1oWFjo5TY3HpdG8zjWm3TIv9vi6y",
  database: "RALB"
});
console.log('Attempting connection...');
con.connect(function(err)
{
  if (err) throw err;
  console.log('Connection estalished.');
  console.log('INIT logging');
  con.query("INSERT INTO datalog VALUES("+'\''+Date()+' INIT\''+")", function (err, result, fields)
  {
    if (err) throw err;
  });
  console.log('INIT log OK');
  console.log('query: SELECT * FROM Users');
  con.query("SELECT * FROM Users", function (err, result, fields)
  {
    if (err) throw err;
    console.log('query OK');
    const { execFile } = require('child_process');//Sync
    var i;
    for (i = 0; i < result.length; i++)
    {
      console.log('exec: '+result[i].CPF+' '+result[i].Password);
      execFile('node', ['/home/rafaelmarinhoa/RALB/norenew.js', result[i].CPF, result[i].Password]);
      console.log('exec OK');
    }
    console.log('logging...');
    con.query("INSERT INTO datalog VALUES("+'\''+Date()+' OK\''+")", function (err, result, fields)
    {
      if (err) throw err;
    });
    console.log('logging done');
    process.exit(0);
  });
});
