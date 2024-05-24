// cars-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import {Application} from '../declarations';
import {Model, Mongoose} from 'mongoose';

export default function (app: Application): Model<any> {
    const modelName = 'cars';
    const mongooseClient: Mongoose = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        autoNumber: {type: String, unique: true, required: true, uppercase: true},
        fullName: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        type: {type: Number, enum: [0, 1, 2], required: true},
        batteryPercent: {type: Number, required: false, default: 0},
        bonus: {type: Number, default: 0},
        bonusPercent: {type: Number, default: 0},
        history: {
            type: Array,
            of: {
                volume: {type: Number, required: true},
                price: {type: Number, required: true},
                column: {type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8]},
                bonusPercent: {type: Number, required: true, default: 0},
                bonusPrice: {type: Number, required: true, default: 0},
                allVolume: {type: Number, required: true},
                bonusPricePerPurchase: {type: Number, required: true},
                volumePrice: {type: Number, required: true},
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        }
    }, {
        timestamps: true
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        (mongooseClient as any).deleteModel(modelName);
    }
    return mongooseClient.model<any>(modelName, schema);
}
