import React from "react";
import {Appointment} from "../types/Types";
import axios from "axios"
import {AppointmentTable} from "../components/AppointmentTable";
import {BASE_URL} from "../App";

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
        let resp = await axios.get<Appointment[]>(`${BASE_URL}/appointments`)
        return resp.data;
    }

    async getAppointmentsForCalendar(): Promise<Appointment[]> {
        let resp = await axios.get<Appointment[]>(`${BASE_URL}/calendar/appointments`)
        return resp.data;
    }

    handleDelete = async (ID: number) => {
        await axios.delete(`${BASE_URL}/appointments/${ID}`)
        await this.updateAppointments();
    }

}