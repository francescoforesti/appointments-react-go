package model

import (
	uuid "github.com/google/uuid"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
	time "time"
)

type RecurrenceType string

const (
	NotRecurring      RecurrenceType = "NO"
	RecurrenceDaily   RecurrenceType = "DAILY"
	RecurrenceWeekly  RecurrenceType = "WEEKLY"
	RecurrenceMonthly RecurrenceType = "MONTHLY"
)

type Appointment struct {
	gorm.Model
	Description string         `json:"description"`
	StartDate   time.Time      `json:"start"`
	EndDate     time.Time      `json:"end"`
	Duration    time.Duration  `json:"duration"`
	Recurring   RecurrenceType `json:"recurring"`
	Reminder    bool           `json:"reminder"`
}

type AppointmentCalendarDTO struct {
	ID          string        `json:"ID"`
	Description string        `json:"description"`
	StartDate   time.Time     `json:"start"`
	Duration    time.Duration `json:"duration"`
	Reminder    bool          `json:"reminder"`
}

func (a *Appointment) ToCalendarDTO() AppointmentCalendarDTO {
	var dto = AppointmentCalendarDTO{}
	_ = copier.Copy(&dto, a)
	dto.ID = uuid.New().String()
	return dto
}

func (a *Appointment) Explode() []Appointment {
	var result []Appointment
	if a.Recurring == RecurrenceDaily {
		result = append(result, a.explodeDaily()...)
	} else if a.Recurring == RecurrenceWeekly {
		result = append(result, a.explodeWeekly()...)
	} else if a.Recurring == RecurrenceMonthly {
		result = append(result, a.explodeMonthly()...)
	} else {
		result = make([]Appointment, 1, 1)
		result = append(result, *a)
	}
	return result
}

func (a *Appointment) explodeDaily() []Appointment {
	return explode(a, 0, 0, 1)
}

func (a *Appointment) explodeWeekly() []Appointment {
	return explode(a, 0, 0, 7)
}

func (a *Appointment) explodeMonthly() []Appointment {
	return explode(a, 0, 1, 0)
}

func explode(a *Appointment, years int, months int, days int) []Appointment {
	var result []Appointment
	start := a.StartDate
	end := a.EndDate
	for start.Before(end) {
		var clone = Appointment{}
		_ = copier.Copy(&clone, a)
		clone.StartDate = start
		clone.EndDate = clone.StartDate
		clone.Recurring = NotRecurring
		start = start.AddDate(years, months, days)
		result = append(result, clone)
	}
	return result
}
