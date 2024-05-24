import assert from 'assert';
import app from '../../src/app';

describe('\'sessions\' service', () => {
  it('registered the service', () => {
    const service = app.service('sessions');

    assert.ok(service, 'Registered the service');
  });
});
