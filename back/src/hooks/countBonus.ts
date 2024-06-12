import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import carsModel from '../models/cars.model';
import app from '../app';

export default function () {
    return async (context: HookContext) => {
        const { data } = context;

        if (!data?.autoNumber || !data?.volume || !data?.price || !data?.column) throw new BadRequest('bad request check all fields');
        const config = await context.app.service('config').find();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - config.data[0].days);

        const purchases = await context.app.service('purchases').find({
            query: {
                autoNumber: context.data.autoNumber,
                createdAt: { $gte: sevenDaysAgo }
            }
        });
        const cars = await carsModel(app).findOne({
            autoNumber: context.data.autoNumber
        });

        const start = +data.volume;

        const sumVolume = purchases.data.reduce((acc: number, curr: any) => acc + +curr.volume, start);

        let bonus = 0;

        if (sumVolume <= config.data[0].firstValue.value) bonus = config.data[0].firstValue.percent;
        else if (sumVolume > config.data[0].firstValue.value && sumVolume <= config.data[0].secondValue.value) bonus = config.data[0].secondValue.percent;
        else if (sumVolume > config.data[0].secondValue.value) bonus = config.data[0].thirdValue.percent;

        const price = data.price / 100 * bonus;

        const history = {
            volume: data.volume,
            price: data.price,
            column: data.column,
            bonusPrice: cars.bonus + price,
            allVolume: +sumVolume + +data.volume,
            bonusPricePerPurchase: price,
            bonusPercent: bonus,
            volumePrice: config.data[0].price
        };

        await context.app.service('cars').patch(null, {
            $push: {
                history: history
            },
            bonus: cars.bonus + price,
            bonusPercent: bonus
        }, { query: { autoNumber: data.autoNumber } });
    };
}
