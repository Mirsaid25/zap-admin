import {ServiceAddons} from '@feathersjs/feathers';
import {AuthenticationService, JWTStrategy} from '@feathersjs/authentication';
import {LocalStrategy} from '@feathersjs/authentication-local';
import {expressOauth} from '@feathersjs/authentication-oauth';

import {Application} from './declarations';

declare module './declarations' {
    interface ServiceTypes {
        'authentication': AuthenticationService & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const authenticationOperators = new AuthenticationService(app, 'authentication-operators');
    const authenticationAdmins = new AuthenticationService(app, 'authentication-admins');

    authenticationAdmins.register('jwt', new JWTStrategy());
    authenticationAdmins.register('local', new LocalStrategy());

    authenticationOperators.register('jwt', new JWTStrategy());
    authenticationOperators.register('local', new LocalStrategy());

    app.use('/authentication/operators', authenticationOperators);
    app.use('/authentication/admins', authenticationAdmins);

    app.configure(expressOauth());
}
