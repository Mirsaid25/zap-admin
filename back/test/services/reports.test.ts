import assert from 'assert';
import app from '../../src/app';

describe('\'reports\' service', () => {
  it('registered the service', () => {
    const service = app.service('reports');

    assert.ok(service, 'Registered the service');
  });
});
