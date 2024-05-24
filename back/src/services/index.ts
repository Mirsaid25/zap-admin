import {Application} from '../declarations';
import admins from './admins/admins.service';
import cars from './cars/cars.service';
import purchases from './purchases/purchases.service';
import config from './config/config.service';
import reports from './reports/reports.service';
import operators from './operators/operators.service';
import sessions from './sessions/sessions.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
    app.configure(admins);
    app.configure(cars);
    app.configure(purchases);
    app.configure(config);
    app.configure(reports);
    app.configure(operators);
    app.configure(sessions);
}
