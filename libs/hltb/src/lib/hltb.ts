import { Axios } from 'axios';
import { DETAIL_URL, IMAGE_URL, SEARCH_URL } from './constants';

type HLTBObj = {
  game_id: number;
  game_name: string;
  game_image: string;
  comp_main: number;
  comp_plus: number;
  comp_100: number;
};

const payload: any = {
  searchType: 'games',
  searchTerms: [],
  searchPage: 1,
  size: 20,
  searchOptions: {
    games: {
      userId: 0,
      platform: '',
      sortCategory: 'popular',
      rangeCategory: 'main',
      rangeTime: {
        min: 0,
        max: 0,
      },
      gameplay: {
        perspective: '',
        flow: '',
        genre: '',
      },
      year: '',
      modifier: '',
    },
    users: {
      sortCategory: 'postcount',
    },
    filter: '',
    sort: 0,
    randomizer: 0,
  },
};

export class HowLongToBeatService {
  axios: Axios;

  constructor() {
    this.axios = new Axios({
      headers: {
        origin: 'https://howlongtobeat.com',
        referer: 'https://howlongtobeat.com',
      },
      timeout: 20000,
    });
  }

  async search(searchQuery: string) {
    const search = { ...payload };
    search.searchTerms = searchQuery.split(' ');

    try {
      const result = await this.axios.post(SEARCH_URL, JSON.stringify(search), {
        headers: {
          'content-type': 'application/json',
        },
      });

      const { data } = JSON.parse(result.data);

      if (data.length) {
        return this.getFormattedData(data[0]);
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * not used for now because search data are enough
   */
  async details(gameId: string) {
    const detailContent = await this.axios.get(`${DETAIL_URL}${gameId}`, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
      },
    });

    const [, jsonData] = detailContent.data.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.+)<\/script>/
    );
    const data = JSON.parse(jsonData);
    const gameData = data.props.pageProps.game.data.game[0];

    return this.getFormattedData(gameData);
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
