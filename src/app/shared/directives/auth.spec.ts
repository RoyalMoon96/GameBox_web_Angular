import { Auth } from './auth';

describe('Auth', () => {
  it('should create an instance', () => {
    const directive = new Auth();
    expect(directive).toBeTruthy();
  });
});
