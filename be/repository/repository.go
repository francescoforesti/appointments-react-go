package repository

import (
	"github.com/francescoforesti/appointments/be/model"
	"gorm.io/gorm"
)

type AppointmentRepository struct {
	DB *gorm.DB
}

func CreateRepository(DB *gorm.DB) AppointmentRepository {
	return AppointmentRepository{DB: DB}
}

func (p *AppointmentRepository) FindAll() []model.Appointment {
	var items []model.Appointment
	p.DB.Find(&items)
	return items
}

func (p *AppointmentRepository) FindByID(id uint) model.Appointment {
	var item model.Appointment
	p.DB.First(&item, id)

	return item
}

func (p *AppointmentRepository) Save(item model.Appointment) model.Appointment {
	p.DB.Save(&item)
	return item
}

func (p *AppointmentRepository) Delete(item model.Appointment) {
	p.DB.Delete(&item)
}
