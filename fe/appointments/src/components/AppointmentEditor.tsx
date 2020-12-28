import {Appointment} from "../types/Types";
import React from "react";
import {Button, DatePicker, Form, Input, Select, Switch} from "antd";
import {FormInstance, FormItemProps} from "antd/es/form";
import moment from "moment";
import {Slider} from "antd/es";

const {RangePicker} = DatePicker;

export interface Props {
    appointment: Appointment;
    onSubmit: (item: Appointment) => void
}

export class AppointmentEditor extends React.Component<Props, {}> {
    private formRef: React.RefObject<FormInstance>;

    constructor(props: Props) {
        super(props);
        this.formRef = React.createRef<FormInstance>()
    }

    render() {

        const tailLayout: FormItemProps = {
            wrapperCol: {
                span: 2,
                offset: 18
            }
        };

        return (
            <div style={{padding: "1rem", marginTop: "5vh"}}>
                <Form
                    ref={this.formRef}
                    labelCol={{span: 4, offset: 1}}
                    wrapperCol={{span: 12, offset: 3}}
                    layout="horizontal"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item label="Description" name="description"
                               rules={[
                                   {
                                       required: true,
                                       message: 'This field is required'
                                   }
                               ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Recurring Type" name="recurring" initialValue="NO">
                        <Select>
                            <Select.Option value="NO">Not Recurring</Select.Option>
                            <Select.Option value="DAILY">Every Day</Select.Option>
                            <Select.Option value="WEEKLY">Every Week</Select.Option>
                            <Select.Option value="MONTHLY">Every Month</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="With Reminder" name="reminder" valuePropName="checked" >
                        <Switch style={{ float: 'left' }}/>
                    </Form.Item>
                    <Form.Item label="Appointment Dates" name="dates"
                               rules={[
                                   {
                                       required: true,
                                       message: 'This field is required'
                                   }
                               ]}>

                        <RangePicker style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label="Appointment Duration (minutes)" name="duration"
                               rules={[
                                   {
                                       required: true,
                                       message: 'This field is required'
                                   }
                               ]}>
                        <Slider defaultValue={60} min={0} max={240} step={5} tooltipVisible={true} tooltipPlacement={"bottom"}/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button htmlType={"submit"}>Save</Button>
                    </Form.Item>

                </Form>
            </div>
        );
    }

    onFinish = (values: any) => {
        let updated = {...this.props.appointment, ...values};
        updated.start = values.dates[0].toISOString();
        updated.end = values.dates[1].toISOString();
        this.props.onSubmit(updated);
    }

    onFinishFailed = () => {
        window.alert("something went wrong")
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        let appointment = nextProps.appointment;
        this.formRef.current?.setFieldsValue({
            ...appointment,
            dates: [moment(appointment.start), moment(appointment.end)]
        })
        return false;
    }
}