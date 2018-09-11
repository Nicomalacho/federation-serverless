const { parseAccount } = require('../../../api/utils');

describe('When parse account', () => {
  it('should success with domain', () => {
    expect(parseAccount('3155964774*ariari.co')).toEqual({ domain: 'ariari.co', identification: '3155964774' });
  });
});
