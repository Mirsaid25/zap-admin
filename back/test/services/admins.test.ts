import assert from 'assert';
import app from '../../src/app';

describe('\'admins\' service', () => {
  it('registered the service', () => {
    const service = app.service('admins');

    assert.ok(service, 'Registered the service');
  });
});
