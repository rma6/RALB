lock=0;

async function enqueue(result)
{
  if(lock==0)
  {
    lock=1;
    console.log('calling norenew for '+result[joins].CPF);
    const child = spawn('node', ['/home/rafaelmarinhoa/RALB/norenew.js', result[joins].CPF, result[joins].Password]);
    child.stdout.on('data', (data) => {
      var msg = data.toString();
      msg=msg.substring(0, msg.length-1);
      console.log(msg);
    });
    child.on('exit', function (code) {
      joins++;
      lock=0;
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

joins=0;

var con = mysql.createConnection({
  host: "localhost",
  user: "web",
  password: "qsXvEsmoT9TcVRpmBw5WZ6vIJmEZoF0j",
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
