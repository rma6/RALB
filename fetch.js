var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "web",
  password: "",
  database: "RALB"
});
console.log(Date());
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
      console.log('exec DONE');
    }
    console.log('logging...');
    con.query("INSERT INTO datalog VALUES("+'\''+Date()+' OK\''+")", function (err, result, fields)
    {
      if (err) throw err;
      console.log('logging done\n');
      process.exit(0);
    });
  });
});
