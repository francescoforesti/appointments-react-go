import React from "react";
import {Appointment} from "../types/Types";
import axios from "axios";
import {RouteComponentProps} from "react-router-dom";
import {AppointmentEditor} from "../components/AppointmentEditor";

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
        let resp = await axios.get<Appointment>('http://localhost:8080/api/v1/appointments/' + id)
        return resp.data;
    }

    private async save(item: Appointment) {
        await axios.post('http://localhost:8080/api/v1/appointments/', item)
    }

    private async update(item: Appointment) {
        await axios.put<Appointment>('http://localhost:8080/api/v1/appointments/' + this.id, item)
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