import { NextApiRequest, NextApiResponse } from 'next';

export default async function updateIGDB(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  /**
   {
      id: 112874,
      age_ratings: [
        56614, 63361,
        63362, 63363,
        63364, 63365,
        63366
      ],
      aggregated_rating: 91.8,
      aggregated_rating_count: 12,
      alternative_names: [ 36451, 57521, 85719, 85720 ],
      artworks: [ 63393, 63394, 63395 ],
      category: 0,
      collection: 6304,
      cover: 115194,
      created_at: 1543501861,
      expansions: [ 228533 ],
      external_games: [
        1684035, 1883016, 2087612,
        2087795, 2119451, 2119516,
        2120003, 2120128, 2120236,
        2120354, 2120448, 2120461,
        2120495, 2120556, 2120568,
        2172943, 2220418, 2220464,
        2254945, 2441999, 2514973,
        2586587, 2586848, 2679648
      ],
      first_release_date: 1645142400,
      follows: 34,
      franchises: [ 2000 ],
      game_engines: [ 412 ],
      game_modes: [ 1 ],
      genres: [ 12, 31 ],
      hypes: 173,
      involved_companies: [ 166703, 166704 ],
      keywords: [ 69, 575, 1459, 10992, 30047 ],        
      name: 'Horizon Forbidden West',
      platforms: [ 48, 167 ],
      player_perspectives: [ 2 ],
      rating: 87.47185558439989,
      rating_count: 100,
      release_dates: [ 306302, 306303 ],
      screenshots: [
        388160, 388161,
        388162, 388163,
        389130, 389131,
        389132
      ],
      similar_games: [
          1877,  25311,
        54842,  81249,
        90099,  96217,
        102584, 103303,
        105049, 105269
      ],
      slug: 'horizon-forbidden-west',
      storyline: 'Aloy treks into an arcane region and faces with new hostile enemies and threat in the search for the 
    cause of a mysterious, dangerous blight.',
      summary: 'Horizon Forbidden West continues Aloy’s story as she moves west to a far-future America to brave a majestic, but dangerous frontier where she’ll face awe-inspiring machines and mysterious new threats.',
      tags: [
                1,        18,
              38, 268435468,
        268435487, 536870981,
        536871487, 536872371,
        536881904, 536900959
      ],
      themes: [ 1, 18, 38 ],
      total_rating: 89.63592779219994,
      total_rating_count: 112,
      updated_at: 1680125367,
      url: 'https://www.igdb.com/games/horizon-forbidden-west',
      videos: [ 37072, 49888, 61869, 62977, 68980 ],
      websites: [
        143447, 143448,
        144654, 214112,
        214113, 214114,
        214115, 214116,
        214465, 214466
      ],
      checksum: 'ae94e921-7144-8523-cd82-c9f949123bae',
      language_supports: [
        471984, 471986, 471988, 471991,
        471992, 471994, 471995, 471996,
        471997, 471998, 471999, 472000,
        472001, 472002, 472003, 472004,
        472005, 472006, 472007, 472008,
        472009, 472010, 472011, 472012,
        472013, 472014, 472015, 472016
      ],
      game_localizations: [ 1054 ]
    }
   */

  res.json({ success: true });
}
