import {HookContext} from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';

const {authenticate} = authentication.hooks;

export default {
    before: {
        all: [],
        find: [],
        get: [],
        create: [authenticate({
            service: 'authentication/operators',
            strategies: ['jwt']
        }), async (context: HookContext) => {
            context.data.operator = context.params.operator;
        }],
        update: [],
        patch: [authenticate({
            service: 'authentication/operators',
            strategies: ['jwt']
        }), async (context: HookContext) => {
            context.data.operator = context.params.operator;
        }],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
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
