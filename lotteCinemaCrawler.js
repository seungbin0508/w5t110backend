import puppeteer from 'puppeteer';
import util from 'util';

const lotteCineamCrawler = async () => {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'develop',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://www.lottecinema.co.kr/NLCHS/#none', {
    waitUntil: 'networkidle2',
  });
  const movies = [];
  for (let i = 1; i < 6; i++) {
    if (i !== 5) {
      await page.click(
        `#contents > div.movi_current_list > ul > li > div > div > div > div > div.owl-stage-outer > div > div:nth-child(${i}) > div > div.top_info > div > div > a:nth-child(2)`
      );
      await page.click(
        `#contents > div.movi_current_list > ul > li > div > div > div > div > div.owl-stage-outer > div > div:nth-child(${i}) > div > div.top_info > div > div > a:nth-child(2)`,
        { waitUntil: 'networkidle2' }
      );
    } else {
      await page.click(
        `#contents > div.movi_current_list > ul > li > div > div > div > div > div.owl-stage-outer > div > div:nth-child(5) > div > div > div > div > a`
      );
      await page.click(
        `#contents > div.movi_current_list > ul > li > div > div > div > div > div.owl-stage-outer > div > div:nth-child(5) > div > div > div > div > a`,
        { waitUntil: 'networkidle2' }
      );
    }

    await page.waitForSelector('#contents > div > div.tit_info > strong');

    const movie = {};

    movie.title = await page.$eval(
      '#contents > div > div.tit_info > strong',
      (element) => {
        return element.textContent;
      }
    );

    movie.grade = await page.$eval(
      '#contents > div > div.tit_info > span',
      (element) => {
        return element.textContent;
      }
    );

    movie.comments = [];
    let comments = {};
    comments.comment = await page.$$eval(
      '#review_con_list2 .review_info',
      (elements) => {
        return elements.map((element) =>
          element.textContent.replace(/\n/g, '')
        );
      }
    );

    comments.name = await page.$$eval(
      '#review_con_list2 .name_info',
      (elements) => {
        return elements.map((element) => element.textContent);
      }
    );

    comments.date = await page.$$eval(
      '#review_con_list2 .date_info',
      (elements) => {
        return elements.map((element) => element.textContent);
      }
    );

    comments.rate = await page.$$eval(
      '#review_con_list2 .top_info .txt_ic_score > strong',
      (elements) => {
        return elements.map((element) => Number(element.textContent));
      }
    );

    for (let i = 0; i < comments.name.length; i++) {
      movie.comments.push({
        name: comments.name[i],
        rate: comments.rate[i],
        comment: comments.comment[i],
        date: comments.date[i],
      });
    }

    movie.bookRate = await page.$eval(
      '#contents > div > ul.detail_info1 > li.sub_info2 > strong',
      (element) => {
        const num = Number(element.textContent.replace('%', '')) / 100;
        return Number(num.toFixed(3));
      }
    );

    movie.genre = await page.$eval(
      '#contents > div > ul.detail_info2 > li.sub_info1 > strong > em:nth-child(1)',
      (element) => {
        return element.textContent;
      }
    );

    movie.releaseDate = await page.$eval(
      '#contents > div > ul.detail_info2 > li.sub_info1 > strong > em:nth-child(2)',
      (element) => {
        return element.textContent.replace(/[^0-9.]/g, '');
      }
    );

    movie.runningTime = await page.$eval(
      '#contents > div > ul.detail_info2 > li.sub_info1 > strong > em.time_info',
      (element) => {
        return Number(element.textContent.replace(/[^0-9]/g, ''));
      }
    );

    movie.director = {};
    movie.director.name = await page.$$eval(
      '#contents > ul > li.active > div > div.movie_detail_people > div.bx_list_people > ul .tit',
      (elements) => {
        return elements[0].textContent;
      }
    );

    movie.director.img = await page.$$eval(
      '#contents > ul > li.active > div > div.movie_detail_people > div.bx_list_people > ul > li > a > span > img',
      (elements) => {
        return elements[0].src;
      }
    );

    movie.actors = [];
    let actors = {};
    actors.name = await page.$$eval(
      '#contents > ul > li.active > div > div.movie_detail_people > div.bx_list_people > ul .tit',
      (elements) => {
        return elements.slice(1).map((element) => element.textContent);
      }
    );

    actors.role = await page.$$eval(
      '#contents > ul > li.active > div > div.movie_detail_people > div.bx_list_people > ul > li > div > div .txt',
      (elements) => {
        return elements.slice(1).map((element) => element.textContent);
      }
    );

    actors.img = await page.$$eval(
      '#contents > ul > li.active > div > div.movie_detail_people > div.bx_list_people > ul > li > a > span > img',
      (elements) => {
        return elements.slice(1).map((element) => element.src);
      }
    );

    for (let i = 0; i < actors.name.length; i++) {
      movie.actors.push({
        name: actors.name[i],
        role: actors.role[i],
        img: actors.img[i],
      });
    }

    movie.viewers = await page.$eval(
      '#contents > div > ul.detail_info1 > li.sub_info3 > strong',
      (element) => {
        return Number(element.textContent.replace(/[^0-9]/g, ''));
      }
    );

    movie.synopsis = {};
    movie.synopsis.content = await page.$eval(
      '#contents > ul > li.active > div > div.movi_tab_info1 > div.left_con > div',
      (element) => {
        return element.textContent;
      }
    );

    movie.preference = {};
    try {
      movie.preference.gender = await page.$eval(
        '#contents > ul > li.active > div > div.movi_tab_info1 > div.right_con > div > div.bx_graph01 > dl > dd.fem > strong',
        (element) => {
          const num = Number(element.textContent.replace(/[^0-9.]/g, '')) / 100;
          return num.toFixed(3);
        }
      );
    } catch {
      movie.preference.gender = null;
      movie.preference.generation = { 10: null, 20: null, 30: null, 40: null };
    }

    movies.push(movie);
    await page.goBack();
  }
  await browser.close();
  return console.log(util.inspect(movies, false, null, true));
};
