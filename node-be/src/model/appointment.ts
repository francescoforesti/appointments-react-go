import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export enum RecurrenceType {
    NotRecurring = "NO",
    RecurrenceDaily = "DAILY",
    RecurrenceWeekly = "WEEKLY",
    RecurrenceMonthly = "MONTHLY"
}

@Entity({name: 'appointments', synchronize: false})
export class Appointment {

    @PrimaryGeneratedColumn({name: 'id'})
    ID: number
    @Column({name: 'created_at'})
    CreatedAt: Date

    @Column({name: 'updated_at'})
    UpdatedAt: Date

    @Column()
    description: string

    @Column({name: 'start_date'})
    start: Date

    @Column({name: 'end_date'})
    end: Date

    @Column()
    duration: number

    @Column({type: "text"})
    recurring: RecurrenceType

    @Column()
    reminder: boolean

    constructor(ID: number, CreatedAt: Date, UpdatedAt: Date, description: string, startdate: Date, enddate: Date, duration: number, recurring: RecurrenceType, reminder: boolean) {
        this.ID = ID;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.description = description;
        this.start = startdate;
        this.end = enddate;
        this.duration = duration;
        this.recurring = recurring;
        this.reminder = reminder;
    }
}

export class AppointmentCalendarDTO {
    ID: string
    description: string
    start: Date
    duration: number
    reminder: boolean

    public static explode(appointment: Appointment): AppointmentCalendarDTO[] {
        let result: AppointmentCalendarDTO[] = [];
        let clones: AppointmentCalendarDTO[] = [];
        switch (appointment.recurring) {
            case RecurrenceType.NotRecurring:
                clones.push(new AppointmentCalendarDTO(appointment));
                break;
            case RecurrenceType.RecurrenceDaily:
                clones = this.explodeDaily(appointment)
                break;
            case RecurrenceType.RecurrenceWeekly:
                clones = this.explodeWeekly(appointment)
                break;
            case RecurrenceType.RecurrenceMonthly:
                clones = this.explodeMonthly(appointment)
                break;
        }
        clones.forEach(c => result.push(c));
        return result;
    }

    constructor(entity: Appointment) {
        this.ID = this.uuidv4();
        this.description = entity.description;
        this.start = entity.start;
        this.duration = entity.duration;
        this.reminder = entity.reminder;
    }

    private uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private static explodeDaily(appointment: Appointment) {
        return this.explodeAtInterval(appointment, (date) => new Date(date.setDate(date.getDate() + 1)));
    }

    private static explodeWeekly(appointment: Appointment) {
        return this.explodeAtInterval(appointment, (date) => new Date(date.setDate(date.getDate() + 7)));
    }

    private static explodeMonthly(appointment: Appointment) {
        return this.explodeAtInterval(appointment, (date) => new Date(date.setMonth(date.getMonth() + 1)));
    }

    private static explodeAtInterval(appointment: Appointment, intervalStepper: (d: Date) => Date) {
        let start = appointment.start;
        let end = appointment.end;
        let result = [];
        while (start < end) {
            let newClone = new Appointment(
                appointment.ID,
                appointment.CreatedAt,
                appointment.UpdatedAt,
                appointment.description,
                start,
                end,
                appointment.duration,
                appointment.recurring,
                appointment.reminder
            )
            result.push(new AppointmentCalendarDTO(newClone))
            start = intervalStepper(start);
        }
        return result;
    }
}