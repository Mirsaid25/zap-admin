import assert from 'assert';
import app from '../../src/app';

describe('\'purchases\' service', () => {
  it('registered the service', () => {
    const service = app.service('purchases');

    assert.ok(service, 'Registered the service');
  });
});
