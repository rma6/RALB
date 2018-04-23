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
      execFileSync('node', ['./norenew.js', result[i].CPF, result[i].Password]);
    }
  });
});
process.exit();
