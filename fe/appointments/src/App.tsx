import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import {Appointments} from "./pages/Appointments";
import {EditAppointment} from "./pages/EditAppointment";
import 'antd/dist/antd.css';
import {AppointmentCalendar} from "./pages/AppointmentCalendar"; // or 'antd/dist/antd.less'

function App() {
  return (
    <div className="App">
        <Switch>
            <Route component={AppointmentCalendar} path="/calendar"/>
            <Route component={Appointments} path="/table"/>
            <Route component={EditAppointment} path="/new" />
            <Route component={EditAppointment} path="/:id" />
        </Switch>
    </div>
  );
}

export default App;
