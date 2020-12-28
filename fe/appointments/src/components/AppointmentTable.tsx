import {Appointment} from "../types/Types";
import React from "react";
import {Button, Popconfirm, Table} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import {Link} from "react-router-dom";
import Title from "antd/es/typography/Title";

interface Props {
    appointments: Appointment[],
    onDelete: (id: number) => void
}

export class AppointmentTable extends React.Component<Props, {}> {

    columns: ColumnsType<Appointment> = [
        {
            title: 'Id',
            dataIndex: 'ID',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'start',
            dataIndex: 'start',
            render: value => value ? new Date(value).toLocaleDateString() : ''
        },
        {
            title: 'end',
            dataIndex: 'end',
            render: value => value ? new Date(value).toLocaleDateString() : ''
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
        },
        {
            title: 'Reminder',
            dataIndex: 'reminder',
            render: value => value ? 'yes' : 'no'
        },
        {
            title: 'Recurring',
            dataIndex: 'recurring',
        },
        {
            title: "Edit",
            render: (text: string, record:Appointment) => <Link to={"/"+record.ID}>Edit</Link>
        }
        ,
        {
            title: "Delete",
            render: (text: string, record:Appointment) =>  <Popconfirm
                title="Are you sure to delete this item?"
                onConfirm={() => this.props.onDelete(record.ID as number)}
                okText="Yes"
                cancelText="No"
            >
                <a href="#">Delete</a>
            </Popconfirm>
        }
    ]

    constructor(props: Props) {
        super(props);
    }

    render() {
        const pagination = {
            pageSize: 10
        }
        const header = (
            <div style={{ display: "flex", justifyContent: "space-between"}}>
                <Title level={5} >Appointments</Title>
                <Link to="/new">
                    <Button type="primary">Create</Button>
                </Link>
            </div>
        )
        return (
            <Table rowKey="ID" columns={this.columns} dataSource={this.props.appointments} title={ () => header} pagination={ pagination } />
        )
    }
}