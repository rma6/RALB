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
    var renew = require('./norenew');
    var i;
    for (i = 0; i < result.length; i++)
    { 
        renew.renew(result[i].CPF, result[i].Password);
        console.log(result[i].CPF+" "+result[i].Password);
    }
  });
});

