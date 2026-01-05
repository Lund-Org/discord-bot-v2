import { Axios } from 'axios';

import { IMAGE_URL, SEARCH_INIT_URL, SEARCH_URL } from './constants';

type HLTBObj = {
  game_id: number;
  game_name: string;
  game_image: string;
  comp_main: number;
  comp_plus: number;
  comp_100: number;
};

const hltbHeaders = {
  accept: '*/*',
  'accept-language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
  priority: 'u=4',
  DNT: '1',
  origin: 'https://howlongtobeat.com',
  referer: 'https://howlongtobeat.com',
  host: 'howlongtobeat.com',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-GPC': '1',
};

const payload = {
  searchOptions: {
    filter: '',
    games: {
      gameplay: {
        difficulty: '',
        flow: '',
        genre: '',
        perspective: '',
      },
      modifier: '',
      platform: '',
      rangeCategory: 'main',
      rangeTime: {
        max: null,
        min: null,
      },
      rangeYear: {
        max: '',
        min: '',
      },
      sortCategory: 'popular',
      userId: 0,
    },
    lists: {
      sortCategory: 'follows',
    },
    randomizer: 0,
    sort: 0,
    users: {
      sortCategory: 'postcount',
    },
  },
  searchPage: 1,
  searchTerms: [],
  searchType: 'games',
  size: 20,
  useCache: true,
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

      const result = await this.axios.post(SEARCH_URL, searchData, {
        headers: {
          ...hltbHeaders,
          'content-type': 'application/json',
          'content-length': searchData.length,
          'x-auth-token': token,
        },
      });

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
    const result = await this.axios.get(SEARCH_INIT_URL, {
      headers: hltbHeaders,
    });
    const data = JSON.parse(result.data);
    const token = data.token;

    return token;
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
