import data from "./data_anime.json" with { type: "json" };
import dataManga from "./data_manga.json" with { type: "json" };

interface Info {
    anime: typeof data.data;
    manga: typeof dataManga.data_manga;
}

const info: Info = {
    anime: data.data,
    manga: dataManga.data_manga,
};

export default info;
