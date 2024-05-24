// purchases-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import {Application} from '../declarations';
import {Model, Mongoose} from 'mongoose';

export default function (app: Application): Model<any> {
    const modelName = 'purchases';
    const mongooseClient: Mongoose = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        volume: {type: Number, required: true},
        price: {type: Number, required: true},
        autoNumber: {type: String, required: true},
        column: {type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8], required: true},
        method: {type: Number, enum: [0, 1], default: 0},
        operator: {
            login: {type: String, required: true},
            fullName: {type: String, required: true}
        },
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
