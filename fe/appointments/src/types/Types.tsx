
enum RecurrenceType {
    NotRecurring = "NO",
    RecurrenceDaily = "DAILY",
    RecurrenceWeekly = "WEEKLY",
    RecurrenceMonthly = "MONTHLY"
}

export interface Appointment {
    ID: number | string
    description: string
    start: string
    end: string
    recurring: RecurrenceType
    reminder: boolean,
    duration: number
}