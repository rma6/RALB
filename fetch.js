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
  console.log('query: SELECT * FROM Users');
  con.query("SELECT * FROM Users", function (err, result, fields)
  {
    if (err) throw err;
    console.log('query OK');
    const { execFileSync } = require('child_process');//Sync
    var i;
    for (i = 0; i < result.length; i++)
    {
      execFileSync('node', ['/home/rafaelmarinhoa/RALB/norenew.js', result[i].CPF, result[i].Password]);
    }
  });
});
