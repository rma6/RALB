var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "web",
  password: "",
  database: "RALB"
});

con.connect(function(err)
{
  if (err) throw err;
  con.query("SELECT * FROM Users", function (err, result, fields)
  {
    if (err) throw err;
    const { execFileSync } = require('child_process');//Sync
    var i;
    for (i = 0; i < result.length; i++)
    {
      execFileSync('node', ['/home/rafaelmarinhoa/RALB/norenew.js', result[i].CPF, result[i].Password]);
    }
    con.query("INSERT INTO datalog VALUES("+'\''+Date()+'\''+")", function (err, result, fields)
    {
      if (err) throw err;
    });
  });
});
process.exit();
