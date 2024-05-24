// Initializes the `sessions` service on path `/sessions`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Sessions } from './sessions.class';
import createModel from '../../models/sessions.model';
import hooks from './sessions.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'sessions': Sessions & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sessions', new Sessions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sessions');

  service.hooks(hooks);
}
