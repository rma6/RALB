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

main();

async function main()
{
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://www.biblioteca.ufpe.br/pergamum/biblioteca_s/php/login_usu.php?flag=index.php');
  await page.evaluate(js, cpf, password);
  await page.waitFor(5000);
  timer = await setInterval(waitEnd, 500, browser);
}

async function waitEnd(b)
{
  pages = await b.pages();
  if(pages.length<=2)
  {
    clearInterval(timer);
    b.close();
    process.exit();
  }
}

function js(cpf, password)
{  
  pergamum = window.open('http://www.biblioteca.ufpe.br/pergamum/biblioteca_s/php/login_usu.php?flag=index.php');
  date_raw = new Date();
  date = ("0"+date_raw.getDate().toString()).slice(-2) + "/" + ("0"+(date_raw.getMonth()+1).toString()).slice(-2) + "/" + date_raw.getFullYear().toString();
  i = 0;
  timer = setInterval(waitLoaded, 500, pergamum, 'id_login', login);

  
  function waitLoaded(page, probe, func)
  {
    if(page.document.getElementById(probe)!=null)
    {
      clearInterval(timer);
      func();
    }
  }
  
  function waitLoginError(page)
  {
    if(page.document.getElementById('alert_login')!=null && page.document.getElementById('alert_login').innerHTML.includes('center'))
    {
      clearInterval(timer);
      clearInterval(timer2);
      
      pergamum.close();
    }
  }
  
  
  function waitEmail(page)
  {
    if(page.document.getElementById('btn_gravar4')!=null)
    {
      clearInterval(wait);
      if(i==(bDates.length/3)-1)
      {
        pergamum.close();
      }
      else
      {
        i++;
        page.document.getElementById('btn_gravar4').click();
      }
    }
  }
  
  
  function login()
  {
    pergamum.document.getElementById('id_login').value = cpf;
    pergamum.document.getElementById('id_senhaLogin').value = password;
    pergamum.document.getElementById('button').click();
    timer = setInterval(waitLoaded, 500, pergamum, 'Accordion1', renew_e);
    timer2 = setInterval(waitLoginError, 500, pergamum);
  }
  
  function renew_e()
  {
    bDates = pergamum.document.getElementsByClassName("txt_cinza_10");
    buttons = pergamum.document.getElementsByClassName("btn_renovar");
    while(i<(bDates.length/3)-1)
    {
      if(date===bDates[3*(i+1)].innerHTML)
      {
        buttons[i].click();
        timer = setInterval(waitLoaded, 500, pergamum, 'btn_gravar4', renew_r);
        break;
      }
      else
      {
        i++;
      }
    }
    if(i>=(bDates.length/3)-1)
    {
      pergamum.close();
    }
  }
  
  function renew_r()
  {
    pergamum.document.getElementById('email').click();
    wait = setInterval(waitEmail, 500, pergamum);
    timer = setInterval(waitLoaded, 500, pergamum, 'Accordion1', renew_e);
  }
}
