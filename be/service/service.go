package service

import (
	"github.com/francescoforesti/appointments/be/model"
	repo "github.com/francescoforesti/appointments/be/repository"
)

type AppointmentService struct {
	AppointmentRepository repo.AppointmentRepository
}

func CreateService(repo repo.AppointmentRepository) AppointmentService {
	return AppointmentService{AppointmentRepository: repo}
}

func (p *AppointmentService) FindAll() []model.Appointment {
	all := p.AppointmentRepository.FindAll()
	if all == nil {
		all = []model.Appointment{}
	}
	return all
}

func (p *AppointmentService) FindByID(id uint) model.Appointment {
	return p.AppointmentRepository.FindByID(id)
}

func (p *AppointmentService) Save(product model.Appointment) model.Appointment {
	p.AppointmentRepository.Save(product)
	return product
}

func (p *AppointmentService) Delete(product model.Appointment) {
	p.AppointmentRepository.Delete(product)
}
