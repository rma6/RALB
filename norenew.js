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
  console.error(e.message);
  process.exit();
});

async function main()
{
  await console.error(cpf+' INIT');
  date_raw = new Date();
  date = ("0"+date_raw.getDate().toString()).slice(-2) + "/" + ("0"+(date_raw.getMonth()+1).toString()).slice(-2) + "/" + date_raw.getFullYear().toString();

  const browser = await puppeteer.launch({args: ['--no-sandbox']});//const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('http://www.biblioteca.ufpe.br/pergamum/biblioteca_s/php/login_usu.php?flag=index.php');

  //login
  await console.error('attempting '+cpf+' login');
  await page.type('#id_login', cpf);
  await page.type('#id_senhaLogin', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#button'),
  ]);
  if(await page.$('#alert_login')) //login error
  {
    await browser.close();
    await console.error(cpf+' login ERROR');
    await process.exit();
  }
  await console.error(cpf+' login OK');

  //renew
  const bDates = await page.$$('.txt_cinza_10');
  await console.error(cpf+' has '+(bDates.length/3-1)+' books');
  var i;
  for(i=0; i<(bDates.length/3)-1; i++)
  {
    await console.error('ckecking '+cpf+' book '+(i+1)+' date');
    if(date===bDates[3*(i+1)].innerHTML)
    {
      await console.error('attempting '+cpf+' book '+(i+1)+' renew');
      //renew book
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('#botao_renovar'+(i+1)),
      ]);
      await console.error(cpf+' book '+(i+1)+' renew OK');
      await console.error('attempting '+cpf+' book '+(i+1)+' send email');
      //send email
      await page.click('#email');
      const wse = page.waitForFunction('document.querySelector("#btn_gravar4").style.display != "none"');
      await wse;
      await console.error(cpf+' book '+(i+1)+' send email OK');
      await console.error(cpf+' book '+(i+1)+' returning');
      //return
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('#btn_gravar4'),
      ]);
    }
  }

  await console.error(cpf+' done OK');
  //close
  await browser.close();
  await process.exit();
}
