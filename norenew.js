var cpf;
var password;
process.argv.forEach(function (val, index, array) {
  if(index==2)
  {
    cpf = val;
  }
  if(index==3)
  {
    password = val;
  }
});

const puppeteer = require('puppeteer');

main().catch(e => {
  console.log(e.message);
  process.exit();
});

async function main()
{
  await console.log(cpf+' INIT');
  date_raw = new Date();
  date = ("0"+date_raw.getDate().toString()).slice(-2) + "/" + ("0"+(date_raw.getMonth()+1).toString()).slice(-2) + "/" + date_raw.getFullYear().toString();

  const browser = await puppeteer.launch({args: ['--no-sandbox']});//const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  
  //testar se isso roda 3 vezes
  try
    await page.goto('http://www.biblioteca.ufpe.br/pergamum/biblioteca_s/php/login_usu.php?flag=index.php');
  catch (error) {
  console.log(error);
  try
    await page.goto('http://www.biblioteca.ufpe.br/pergamum/biblioteca_s/php/login_usu.php?flag=index.php');
    catch (error) {
    console.log(error);
    try
      await page.goto('http://www.biblioteca.ufpe.br/pergamum/biblioteca_s/php/login_usu.php?flag=index.php');
    }
  }

  //login
  await console.log('attempting '+cpf+' login');
  await page.type('#id_login', cpf);
  await page.type('#id_senhaLogin', password);
  await page.click('#button');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  if(await page.$('#alert_login') !=null) //login error
  {
    await browser.close();
    await console.log(cpf+' login ERROR');
    await process.exit();
  }
  await console.log(cpf+' login OK');

  //renew
  const bDates = await page.evaluate(() => {
        const dates = Array.from(document.querySelectorAll('.txt_cinza_10'))
        return dates.map(td => td.innerHTML)
  });
  await console.log(cpf+' has '+(bDates.length/3-1)+' books');
  var i;
  for(i=0; i<(bDates.length/3)-1; i++)
  {
    await console.log('ckecking '+cpf+' book '+(i+1)+' date '+bDates[3*(i+1)]);
    if(date===bDates[3*(i+1)])
    {
      await console.log('attempting '+cpf+' book '+(i+1)+' renew');
      //renew book
      await page.click('#botao_renovar'+(i+1));
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      await console.log(cpf+' book '+(i+1)+' renew OK');
      await console.log('attempting '+cpf+' book '+(i+1)+' send email');
      //send email
      await page.click('#email');
      const wse = page.waitForFunction('document.querySelector("#btn_gravar4").style.display != "none"');
      await wse;
      await console.log(cpf+' book '+(i+1)+' send email OK');
      await console.log(cpf+' book '+(i+1)+' returning');
      //return
      await page.click('#btn_gravar4');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
  }

  await console.log(cpf+' done OK');
  //close
  await browser.close();
  await process.exit();
}
