import { cardGenerator } from './card-generator';

describe('cardGenerator', () => {
  it('should work', () => {
    expect(cardGenerator()).toEqual('card-generator');
  });
});
