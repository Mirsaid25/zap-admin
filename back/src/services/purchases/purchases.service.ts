// Initializes the `purchases` service on path `/purchases`
import {ServiceAddons} from '@feathersjs/feathers';
import {Application} from '../../declarations';
import {Purchases} from './purchases.class';
import createModel from '../../models/purchases.model';
import hooks from './purchases.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'purchases': Purchases & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate'),
        lean: true
    };

    // Initialize our service with any options it requires
    app.use('/purchases', new Purchases(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('purchases');

    service.hooks(hooks);
}
