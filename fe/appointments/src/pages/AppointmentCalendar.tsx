import React from "react";
import {Appointment} from "../types/Types";
import axios from "axios"
import {Calendar} from "antd";
import moment from "moment";
import {Col, Descriptions, Popover, Tag} from "antd/es";

interface State {
    appointments: Appointment[]
}

export class AppointmentCalendar extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            appointments: []
        }
    }

    render() {
        return (
            <div style={{padding: "1rem"}}>
                <Calendar dateCellRender={this.dateCellRender}/>
            </div>
        );
    }

    dateCellRender = (value: moment.Moment) => {
        const listData = this.getListData(value);
        return (
            <div className="events">
                {
                    listData.map(item => (

                            <Popover
                                content={
                                    <div>
                                        <span>Start Date: {item.start}</span><br/>
                                        <span>Duration: {item.duration}</span><br/>
                                        <span>Reminder: {item.reminder}</span><br/>
                                    </div>
                                }
                                title={item.description}
                                trigger="hover">
                                <Tag color="purple">{item.description}</Tag>
                            </Popover>
                        )
                    )
                }
            </div>
        );
    }

    getListData(value: moment.Moment): Appointment[] {
        let listData: Appointment[] = [];
        if (this.state.appointments) {
            this.state.appointments.filter(a => this.isSameDate(a, value))
                .forEach(a => listData.push(a));
        }
        return listData;
    }

    private isSameDate(a: Appointment, value: moment.Moment) {
        let moment1 = moment(a.start);
        return moment1.dayOfYear() == value.dayOfYear() && moment1.year() == value.year();
    }

    openDetail = (item: Appointment) => {

    }

    async componentDidMount() {
        let data = await this.getAppointmentsForCalendar();
        this.setState({appointments: data})
    }

    async getAppointmentsForCalendar(): Promise<Appointment[]> {
        let resp = await axios.get<Appointment[]>('http://localhost:8080/api/v1/calendar/appointments')
        return resp.data;
    }
}