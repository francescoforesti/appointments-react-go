import Express from "./server/server";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Appointment} from "./model/appointment";

export class Application {

    main() {
        createConnection({
            type: "postgres",
            host: "0.0.0.0",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "appointments",
            entities: [
                Appointment
            ],
            synchronize: true,
            logging: true
        }).then(connection => {

            let express: Express = new Express(connection);

            express.listen(8081, function () {
                console.log('App is listening on port 8081!');
            });

        }).catch(error => console.log(error));

    }

}

function main() {
    new Application().main();
}

if (require.main === module) {
    main();
}
