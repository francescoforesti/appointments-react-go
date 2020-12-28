import React from "react";
import {Appointment} from "../types/Types";
import axios from "axios";
import {RouteComponentProps} from "react-router-dom";
import {AppointmentEditor} from "../components/AppointmentEditor";
import {BASE_URL} from "../App";

interface Parameters {
    id?: string
}

interface State {
    appointment: Appointment
}

export class EditAppointment extends React.Component<RouteComponentProps<Parameters>, State> {

    id?: number;

    constructor(props: RouteComponentProps<Parameters>) {
        super(props);
        this.state = {
            appointment: {} as Appointment
        };
        if (props.match.params.id) {
            this.id = Number(props.match?.params?.id);
        }
    }

    render() {
        return (<AppointmentEditor appointment={this.state.appointment} onSubmit={this.saveOrUpdate}/>);
    }

    private async getAppointment(id: number) {
        let resp = await axios.get<Appointment>(`${BASE_URL}/appointments/${id}`)
        return resp.data;
    }

    private async save(item: Appointment) {
        await axios.post(`${BASE_URL}/appointments/`, item)
    }

    private async update(item: Appointment) {
        await axios.put<Appointment>(`${BASE_URL}/appointments/` + this.id, item)
    }

    async componentDidMount() {
        if (this.id) {
            this.setState({appointment: await this.getAppointment(this.id)});
        }
    }

    saveOrUpdate = async (item: Appointment) => {
        if (this.id) {
            await this.update(item);
        } else {
            await this.save(item);
        }
        this.props.history.push('/table');
    }
}