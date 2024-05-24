import {HookContext} from '@feathersjs/feathers';
import {iff} from 'feathers-hooks-common';
import countBonus from '../../hooks/countBonus';
import discountBonus from '../../hooks/discountBonus';
import createReport from '../../hooks/createReport';
import {BadRequest} from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

export default {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            iff((context: HookContext) => context.data.isTaxi && !context.data?.useBonus, countBonus()),
            iff((context: HookContext) => context.data?.useBonus, discountBonus()),
            iff((context: HookContext) => !context.data.isTaxi, async (context: HookContext) => {
                const {data} = context;
                if (!data?.autoNumber || !data?.volume || !data?.price || !data?.column) throw new BadRequest('bad request check all fields');
                const config = await context.app.service('config').find();

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - config.data[0].days);

                const purchases = await context.app.service('purchases').find({
                    query: {
                        autoNumber: context.data.autoNumber,
                        createdAt: {$gte: sevenDaysAgo}
                    }
                });

                const sumVolume = purchases.data.reduce((acc: number, curr: any) => acc + +curr.volume, 0);

                const history = {
                    volume: data.volume,
                    price: data.price,
                    column: data.column,
                    bonusPrice: 0,
                    allVolume: sumVolume,
                    bonusPricePerPurchase: 0,
                    bonusPercent: 0,
                    volumePrice: config.data[0].price
                };

                await context.app.service('cars').patch(null, {
                    $push: {
                        history: history
                    },
                    bonus: 0,
                    bonusPercent: 0
                }, {query: {autoNumber: data.autoNumber}});
            }),
            createReport(),
        ],
        update: [],
        patch: [],
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
