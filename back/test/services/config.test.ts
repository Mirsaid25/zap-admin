import assert from 'assert';
import app from '../../src/app';

describe('\'config\' service', () => {
  it('registered the service', () => {
    const service = app.service('config');

    assert.ok(service, 'Registered the service');
  });
});
