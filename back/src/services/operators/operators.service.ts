// Initializes the `operators` service on path `/operators`
import {ServiceAddons} from '@feathersjs/feathers';
import {Application} from '../../declarations';
import createModel from '../../models/operators.model';
import { Operators } from './operators.class';
import hooks from './operators.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'operators': Operators & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/operators', new Operators(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('operators');

    service.hooks(hooks);
}
