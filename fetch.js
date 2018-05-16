lock=0;
it=0;
joins=0;

async function enqueue(result)
{
  if(lock<=1 && it<result.length)
  {
    lock++;
    console.log('calling norenew for '+result[it].CPF);
    const child = spawn('node', ['/home/rafaelmarinhoa/RALB/norenew.js', result[it].CPF, result[it].Password]);
    it++;
    child.stdout.on('data', (data) => {
      var msg = data.toString();
      msg=msg.substring(0, msg.length-1);
      console.log(msg);
    });
    child.stderr.on('data', (data) => {
      var msg = data.toString();
      msg=msg.substring(0, msg.length-1);
      console.log(msg);
    });
    child.on('exit', function (code) {
      joins++;
      lock--;
    });
  }
  if(result.length==joins)
  {
    clearInterval(timer);
    console.log('fetch done\n');
    process.exit();
  }
}

var mysql = require('mysql');
var { spawn } = require('child_process');

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
    timer = setInterval(enqueue, 1000, result);
  });
});
