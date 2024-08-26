import { Axios } from 'axios';

import { BASE_URL, IMAGE_URL, SEARCH_URL } from './constants';

type HLTBObj = {
  game_id: number;
  game_name: string;
  game_image: string;
  comp_main: number;
  comp_plus: number;
  comp_100: number;
};

const hltbHeaders = {
  origin: 'https://howlongtobeat.com',
  referer: 'https://howlongtobeat.com',
  host: 'howlongtobeat.com',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
};

const payload = {
  searchType: 'games',
  searchPage: 1,
  size: 20,
  searchOptions: {
    games: {
      userId: 0,
      platform: '',
      sortCategory: 'popular',
      rangeCategory: 'main',
      rangeTime: {
        min: null,
        max: null,
      },
      gameplay: {
        perspective: '',
        flow: '',
        genre: '',
      },
      rangeYear: {
        min: '',
        max: '',
      },
      modifier: '',
    },
    users: {
      sortCategory: 'postcount',
    },
    lists: {
      sortCategory: 'follows',
    },
    filter: '',
    sort: 0,
    randomizer: 0,
  },
  useCache: true,
  searchTerms: [],
};

export class HowLongToBeatService {
  axios: Axios;

  constructor() {
    this.axios = new Axios({
      timeout: 20000,
    });
  }

  async search(searchQuery: string) {
    try {
      const token = await this.getHLTBToken();

      const search = { ...payload };
      search.searchTerms = searchQuery.split(' ');

      const searchData = JSON.stringify(search);
      const result = await this.axios.post(
        `${SEARCH_URL}/${token}`,
        searchData,
        {
          headers: {
            ...hltbHeaders,
            'content-type': 'application/json',
            'content-length': searchData.length,
          },
        },
      );

      const { data } = JSON.parse(result.data);

      if (data.length) {
        return this.getFormattedData(data[0]);
      }

      return undefined;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // /**
  //  * not used for now because search data are enough
  //  */
  // async details(gameId: string) {
  //   const detailContent = await this.axios.get(`${DETAIL_URL}${gameId}`, {
  //     headers: {
  //       ...hltbHeaders,
  //     },
  //   });

  //   const [, jsonData] = detailContent.data.match(
  //     /<script id="__NEXT_DATA__" type="application\/json">(.+)<\/script>/
  //   );
  //   const data = JSON.parse(jsonData);
  //   const gameData = data.props.pageProps.game.data.game[0];

  //   return this.getFormattedData(gameData);
  // }

  private async getHLTBToken() {
    const result = await this.axios.get(BASE_URL, {
      headers: {
        ...hltbHeaders,
      },
    });
    const startIndex = result.data.indexOf(
      `<script src="/_next/static/chunks/pages/_app-`,
    );
    const endIndex = result.data.indexOf(`</script>`, startIndex);

    const scriptTag = result.data.substr(startIndex, endIndex - startIndex);
    const scriptUrlMatch = scriptTag.match(/src="([0-9a-zA-Z\-_./]+)"/);

    const scriptResult = await this.axios.get(BASE_URL + scriptUrlMatch[1], {
      headers: {
        ...hltbHeaders,
      },
    });
    const tokenMatch = (scriptResult.data as string).match(
      new RegExp(`"/api/search/".concat\\("([a-zA-Z0-9]+)"\\)`),
    );

    return tokenMatch[1];
  }

  private getFormattedData(data: HLTBObj) {
    return {
      name: data.game_name,
      imageUrl: `${IMAGE_URL}${data.game_image}`,
      gameplayMain: this.secondsToHours(data.comp_main),
      gameplayMainExtra: this.secondsToHours(data.comp_plus),
      gameplayCompletionist: this.secondsToHours(data.comp_100),
    };
  }

  private secondsToHours(time: number) {
    const hours = time / 3600;
    const minutes = (hours - Math.floor(hours)) * 60;

    return `${Math.floor(hours)}h${Math.round(minutes)}`;
  }
}
