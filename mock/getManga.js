const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

async function pendingSebentar(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const convertTime = (tgl) => {
  let dateUpdate = new Date(tgl);
  let timeago = moment(dateUpdate).fromNow();
  return timeago;
};

const fetchRss = async (url) => {
  let response = await axios.get(url);
  let data = response.data;
  const parser = new XMLParser();
  let jObj = parser.parse(data);
  console.log(jObj.rss.channel.item.length);

  return jObj.rss.channel.item;
};

const jikan = async (id) => {
  let url = `https://api.jikan.moe/v4/manga/${id}`;
  let response = await axios.get(url);
  let data = response.data.data;
  return data;
};

fetchRss("https://myanimelist.net/rss.php?type=rm&u=sinkaroid").then(
  async (res) => {
    let info = [];
    for (let i = 0; i < res.length; i++) {
      //res.length
      let item = res[i];
      let title = item.title;
      let link = item.link;
      let description = item.description;
      let pubDate = item.pubDate;
      let timeago = convertTime(pubDate);
      let id = link.split("/")[4];

      await pendingSebentar(5000);
      let image, tag, synopsis;
      let pictures;

      await jikan(Number(id)).then((res) => {
        console.log("Saved..", title);
        image = res.images.jpg.large_image_url;
        tag = res.genres.map((item) => {
          return item.name;
        });
        synopsis = res.synopsis;
        pictures = [{ img: res.images.jpg.large_image_url }];
      });

      let itemInfo = {
        title,
        link,
        description,
        pubDate,
        timeago,
        id,
        image,
        tag,
        synopsis,
        pictures,
      };

      info.push(itemInfo);
    }
    //write anime.json
    fs.writeFileSync(
      "mock/_manga.json",
      JSON.stringify({ data_manga: info }, null, 4)
    );
  }
);
