const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const puppeteer = require('puppeteer');
var a=['/movies','/web-series','/shows'];
const URL = "https://www.mxplayer.in";
const fastcsv = require('fast-csv');   
const ws = fs.createWriteStream("only_movies.csv"); 
var data = [['Type','Title','Language_and_Year_of_Movie','Image_src','URL']];
(async () => {

  const browser = await puppeteer.launch({
    headless: false,
   args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
  const page = await browser.newPage();
for(var i=0;i<a.length;i++)
{
  await page.goto(URL+a[i],{timeout: 120000, waitUntil: 'networkidle0'});
 await scroll(page,a[i]);
  let content = await page.content()
  let $ = cheerio.load(content)
  console.log($('.section','#main').length);
   
   $('.section','#main').each(function(j, ele) {
$(ele).find('.slide').each(function(k, elem) {
     var b=[];
    if(i==0)
     b[0]="Movie"
    if(i==1)
    b[0]="Web-series"
   if(i==2)
  b[0]="TV Show"
      b[1]=$(this).find('.image-card').attr('title');
      b[2]=$(this).find('.card-details').find('div').eq(1).text();
      b[3]=$(this).find('.image-card').attr('src');
      b[4]=$(this).children().children().attr('href');
   // console.log(b);
      data.push(b);
     //console.log($(this).find('.image-card').attr('src'));
     //console.log($(this).find('.card-details').find('div').eq(1).text());
    });
});
}
  await browser.close();
store(data);
})();
function store(data)
{
console.log(data);
fastcsv  
  .write(data, { headers: true })
  .pipe(ws);
}
 
async function scroll (page,url) {
  let i = 0;
 // let content = await page.content()
  //let $ = cheerio.load(content)
  let k;
  if(url=='/movies')
  k=33;
  if(url=='/web-series')
  k=25;
  if(url=='/shows') 
  k=40;
//var a=$('.section','#main').length;
//let items = [];
//console.log(a);
//var a=$('.section','#main').length;
let previousHeight;
    while (i < k) {
  i++;
let content = await page.content()
  //let $ = cheerio.load(content)
//var a=$('.section','#main').length;
//console.log(a);

      previousHeight = await page.evaluate('window.innerHeight');
      //console.log(previousHeight);
      await page.evaluate('window.scrollBy(0,window.innerHeight)');
      await page.waitFor(2000);
}
}



