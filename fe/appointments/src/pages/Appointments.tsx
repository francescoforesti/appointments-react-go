import React from "react";
import {Link} from "react-router-dom";
import {Appointment} from "../types/Types";
import axios from "axios"
import {AppointmentTable} from "../components/AppointmentTable";

interface State {
    appointments: Appointment[]
}

export class Appointments extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            appointments: []
        }
    }

    render() {
        return (
            <div style={{padding: "1rem"}}>

                <AppointmentTable appointments={this.state.appointments} onDelete={this.handleDelete}/>

            </div>
        );
    }

    async componentDidMount() {
        await this.updateAppointments();
    }


    private async updateAppointments() {
        let appointments = await this.getAppointments();
        console.log(appointments);
        this.setState({appointments: appointments});
    }

    async getAppointments(): Promise<Appointment[]> {
        let resp = await axios.get<Appointment[]>('http://localhost:8080/api/v1/appointments')
        return resp.data;
    }

    async getAppointmentsForCalendar(): Promise<Appointment[]> {
        let resp = await axios.get<Appointment[]>('http://localhost:8080/api/v1/calendar/appointments')
        return resp.data;
    }

    handleDelete = async (ID: number) => {
        await axios.delete(`http://localhost:8080/api/v1/appointments/${ID}`)
        await this.updateAppointments();
    }

}