const puppeteer = require('puppeteer');

(async function scrape() {
  const browser = await puppeteer.launch({ headless: false });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
  await page.goto('https://soundcloud.com/k1ba01/tracks');
  
  await page.waitForSelector('.soundTitle__usernameTitleContainer');
  
  // extracting information from usernames
  let trackList = await page.evaluate(() => {

    const tracks = document.body.querySelectorAll('div.soundTitle__usernameTitleContainer');
    // console.log(tracks)

    let trackList = Object.values(tracks).map(track => {
      const username = track.getElementsByClassName('soundTitle__usernameText')[0]
                    .textContent ?? null

      const title = track
                    .getElementsByClassName('sc-link-primary soundTitle__title')[0]
                    .textContent ?? null

      const link = `https://soundcloud.com/${track
                    .getElementsByClassName('sc-link-primary soundTitle__title')[0]
                    .getAttribute('href') ?? null}`
      
      if (!username.includes('k1ba')) return

      return {
        username: username,
        title: title,
        link: link
      }
    });

    return trackList;
  });

  // logging results
  console.log(trackList);
  await browser.close();

})();