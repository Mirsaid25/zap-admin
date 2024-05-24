// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import {HookContext} from '@feathersjs/feathers';
import {NotAuthenticated} from '@feathersjs/errors';
import {parseJwt} from './utils/parseJWT';
import reportsModel from './models/reports.model';
import app from './app';
import {iff} from 'feathers-hooks-common';

export default {
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [
            iff(context => !context.path.includes('authentication') && !context.path.includes('sessions'), async (context: HookContext) => {
                const auth: any = context.params.authentication;

                if (!auth?.accessToken) {
                    throw new NotAuthenticated('Not authorized');
                }

                const payload: any = parseJwt(auth.accessToken);

                let operator: any = {};

                try {
                    operator = await context.app.service('operators').get(payload.sub);
                } catch (e) {
                    return;
                }

                const methods = ['create', 'patch', 'remove'];

                await reportsModel(app).create({
                    method: methods.indexOf(context.method),
                    data: context.data,
                    path: context.path,
                    operator: {
                        fullName: operator.fullName,
                        login: operator.login
                    }
                });
            })],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
