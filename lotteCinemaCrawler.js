import puppeteer from 'puppeteer';
import {Movie} from './models/index.js'

async function lotteCinemaCrawler() {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV !== 'develop',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://www.lottecinema.co.kr/NLCHS/Movie/List?flag=1', {
    waitUntil: 'networkidle2',
  });
  const movies = [];
  for (let i = 1; i < 12; i++) {
    if (i !== 5) {
      await page.click(
        `#contents > div > ul.movie_list.type2 > li:nth-child(${i}) > div.top_info > div > div > a:nth-child(2)`
      );
      await page.click(
        `#contents > div > ul.movie_list.type2 > li:nth-child(${i}) > div.top_info > div > div > a:nth-child(2)`,
        { waitUntil: 'networkidle2' }
      );

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

      /// 코멘트는 직접 작성하신다고 하셔서 일단 주석처리
      
      // movie.comments = [];
      // const comments = {};
      // comments.comment = await page.$$eval(
      //   '#review_con_list2 .review_info',
      //   (elements) => {
      //     return elements.map((element) =>
      //       element.textContent.replace(/\n/g, '')
      //     );
      //   }
      // );

      // comments.name = await page.$$eval(
      //   '#review_con_list2 .name_info',
      //   (elements) => {
      //     return elements.map((element) => element.textContent);
      //   }
      // );

      // comments.date = await page.$$eval(
      //   '#review_con_list2 .date_info',
      //   (elements) => {
      //     return elements.map((element) => element.textContent);
      //   }
      // );

      // comments.rate = await page.$$eval(
      //   '#review_con_list2 .top_info .txt_ic_score > strong',
      //   (elements) => {
      //     return elements.map((element) => Number(element.textContent));
      //   }
      // );

      // for (let i = 0; i < comments.name.length; i++) {
      //   movie.comments.push({
      //     name: comments.name[i],
      //     rate: comments.rate[i],
      //     comment: comments.comment[i],
      //     date: comments.date[i],
      //   });
      // }

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
      const actors = {};
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

      movie.specialCinemas = await page.$$eval(
        '#contents > div > div.spacial_hall_info > span > img',
        (elements) => {
          return elements.map((element) => element.src);
        }
      );

      movie.viewers = await page.$eval(
        '#contents > div > ul.detail_info1 > li.sub_info3 > strong',
        (element) => {
          return Number(element.textContent.replace(/[^0-9]/g, ''));
        }
      );

      movie.synopsis = await page.$eval(
        '#mCSB_1_container > p > span',
        (element) => {
          return element.outerHTML;
        }
      );

      movie.preference = {};
      try {
        movie.preference.gender = await page.$eval(
          '#contents > ul > li.active > div > div.movi_tab_info1 > div.right_con > div > div.bx_graph01 > dl > dd.fem > strong',
          (element) => {
            const num =
              Number(element.textContent.replace(/[^0-9.]/g, '')) / 100;
            return num.toFixed(3);
          }
        );

        const gen_list = await page.$eval(
          '#contents > ul > li.active > div > div.movi_tab_info1 > div.right_con > div > div.bx_graph02 > dl',
          (element) => {
            let target = element.textContent
              .replace(/%/g, ' ')
              .replace(/..대/g, '')
              .split(' ');

            return target.map((x) => Number(x));
          }
        );

        movie.preference.generation = {
          10: gen_list[0],
          20: gen_list[1],
          30: gen_list[2],
          40: gen_list[3],
        };
      } catch {
        movie.preference.gender = null;
        movie.preference.generation = {
          10: null,
          20: null,
          30: null,
          40: null,
        };
      }
      try {
        const trailersCnt = await page.$eval(
          '#movie_trailer > h5.tit_info',
          (element) => {
            return Number(element.textContent.replace(/[^0-9]/g, ''));
          }
        );

        await page.click('#movie_trailer_0 > a');

        const trailer = await page.$eval('#vdoPlayer', (element) => {
          return element.src.split('.');
        });

        movie.trailers = [];

        for (let i = 1; i < trailersCnt + 1; i++) {
          trailer[trailer.length - 2] =
            trailer[trailer.length - 2].slice(0, -1) + i;
          movie.trailers.push(trailer.join('.'));
        }

        await page.keyboard.press('Escape');
      } catch {
        movie.trailers = null;
      }

      movie.photos = await page.$$eval(
        '#movie_poster > div.stealcut_thumb_wrap > div > div > div.owl-stage-outer > div img',
        (elements) => {
          return elements.map((element) => element.src);
        }
      );

      movies.push(movie);
      await page.goto('https://www.lottecinema.co.kr/NLCHS/Movie/List?flag=1', {
        waitUntil: 'networkidle2',
      });
    }
  }
  await browser.close();
  return movies;
}
const movies = await lotteCinemaCrawler() 
await Movie.replaceAllDocuments(movies)


