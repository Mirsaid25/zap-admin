// reports-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import {Application} from '../declarations';
import {Model, Mongoose} from 'mongoose';

export default function (app: Application): Model<any> {
    const modelName = 'reports';
    const mongooseClient: Mongoose = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        method: {type: Number, enum: [0, 1, 2], required: true},
        data: {},
        operator: {
            login: {type: String, required: true},
            fullName: {type: String, required: true}
        },
        path: {type: String, required: true}
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
