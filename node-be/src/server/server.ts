import express from 'express';
import {Connection} from "typeorm";
import {Appointment, AppointmentCalendarDTO} from "../model/appointment";
import bodyParser from "body-parser";

const appointmentsUrl = '/api/v1/appointments';
const calendarUrl = '/api/v1/calendar/appointments';

export default class Express {
    private _express: express.Application;
    private _connection: Connection;

    public constructor(connection: Connection) {
        this._express = express();
        this._express.use(bodyParser.json());
        this._express.use(bodyParser.urlencoded({ extended: true }));

        this._connection = connection;

        this.findAllAppointments();
        this.findAppointmentById();
        this.createAppointment();
        this.updateAppointment();
        this.deleteAppointment();
        this.findCalendarAppointments();

    }

    listen(port: number, callback: () => void) {
        this._express
            .listen(port, callback);
    }

    private addApi(api: (self: Express) => void): void {
        api(this);
    }

    private findAllAppointments() {
        console.log("adding findAll")
        this.addApi((self: Express) =>
            self._express.get(appointmentsUrl, function (req, res) {
                self._connection.manager.find(Appointment, {where: 'deleted_at is null'})
                    .then(list => res.send(list))
            })
        );
    }

    private findAppointmentById() {
        console.log("adding findById")
        this.addApi((self: Express) =>
            self._express.get(`${appointmentsUrl}/:id`, function (req, res) {
                self._connection.manager.findOne(Appointment, req.params.id)
                    .then(e => res.send(e));
            })
        );
    }

    private createAppointment() {
        console.log("adding create")
        this.addApi((self: Express) =>
            self._express.post(appointmentsUrl, function (req, res) {
                console.log(req);
                console.log(req.body)
                let newEntity = self._connection.manager.create(Appointment, req.body)
                console.log(newEntity)
                self._connection.manager.save(Appointment, newEntity).then(
                    saved => res.status(201).send(saved)
                )
            })
        );
    }

    private updateAppointment() {
        console.log("adding update")
        this.addApi((self: Express) =>
            self._express.put(`${appointmentsUrl}/:id`, function (req, res) {
                self._connection.manager.save(Appointment, req.body).then(
                    saved => res.send(saved)
                )
            })
        );
    }

    private deleteAppointment() {
        console.log("adding delete")
        this.addApi((self: Express) =>
            self._express.delete(`${appointmentsUrl}/:id`, function (req, res) {
                self._connection.manager.delete(Appointment, req.params.id as unknown as number).then(
                    saved => res.status(204).send()
                )
            })
        );
    }

    private findCalendarAppointments() {
        console.log("adding calendar findAll")
        this.addApi((self: Express) =>
            self._express.get(calendarUrl, function (req, res) {
                self._connection.manager.find(Appointment, {where: 'deleted_at is null'})
                    .then(list => {
                        let all: AppointmentCalendarDTO[] = [];
                        let exploded = list.forEach(e => all = all.concat(AppointmentCalendarDTO.explode(e)));
                        all.sort(
                            (a, b) => b.start.getDate() - a.start.getDate()
                        );
                        res.send(all)
                    })
            })
        );
    }

}



