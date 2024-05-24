// Initializes the `reports` service on path `/reports`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Reports } from './reports.class';
import createModel from '../../models/reports.model';
import hooks from './reports.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'reports': Reports & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/reports', new Reports(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('reports');

  service.hooks(hooks);
}
