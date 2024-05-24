import {HookContext} from '@feathersjs/feathers';
import {NotAuthenticated} from '@feathersjs/errors';
import {parseJwt} from '../utils/parseJWT';

export default () => {
    return async (context: HookContext) => {
        const data = context.data;

        const auth: any = context.params.authentication;

        if (!auth?.accessToken) {
            throw new NotAuthenticated('Not authorized');
        }

        const payload: any = parseJwt(auth.accessToken);

        let operator: any = {};

        try {
            operator = await context.app.service('operators').get(payload.sub);
        } catch (e) {
            operator = await context.app.service('admins').get(payload.sub);
        }

        data.operator = {
            fullName: operator?.fullName || 'admin',
            login: operator?.login
        };
    };
};
