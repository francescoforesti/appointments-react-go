package routers

import (
	"github.com/francescoforesti/appointments/be/model"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"sort"
	"strconv"
)
import service "github.com/francescoforesti/appointments/be/service"

type AppointmentAPI struct {
	AppointmentService service.AppointmentService
}

func CreateAPI(p service.AppointmentService) AppointmentAPI {
	return AppointmentAPI{AppointmentService: p}
}

func (a *AppointmentAPI) Create(c *gin.Context) {
	var item model.Appointment
	err := c.BindJSON(&item)
	if err != nil {
		log.Fatalln(err)
		c.Status(http.StatusBadRequest)
		return
	}
	created := a.AppointmentService.Save(item)
	c.JSON(http.StatusOK, created)
}

func (a *AppointmentAPI) FindAll(c *gin.Context) {
	items := a.AppointmentService.FindAll()
	c.JSON(http.StatusOK, items)
}

func (a *AppointmentAPI) FindAllCalendar(c *gin.Context) {
	items := a.AppointmentService.FindAll()
	calendarItems := explodeRecurringAppointments(items)
	sort.Slice(calendarItems, func(i, j int) bool {
		return calendarItems[i].StartDate.UnixNano() < calendarItems[j].StartDate.UnixNano()
	})

	c.JSON(http.StatusOK, calendarItems)
}

func explodeRecurringAppointments(items []model.Appointment) []model.AppointmentCalendarDTO {
	explodedItems := make([]model.Appointment, len(items), cap(items))
	for _, item := range items {
		explodedItems = append(explodedItems, item.Explode()...)
	}
	dtos := make([]model.AppointmentCalendarDTO, len(explodedItems), cap(explodedItems))
	for _, exploded := range explodedItems {
		dtos = append(dtos, exploded.ToCalendarDTO())
	}
	return dtos
}

func (a *AppointmentAPI) FindOne(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	item := a.AppointmentService.FindByID(uint(id))

	c.JSON(http.StatusOK, item)
}

func (a *AppointmentAPI) Update(c *gin.Context) {
	var item model.Appointment
	err := c.BindJSON(&item)
	if err != nil {
		log.Fatalln(err)
		c.Status(http.StatusBadRequest)
		return
	}

	id, _ := strconv.Atoi(c.Param("id"))
	fromDB := a.AppointmentService.FindByID(uint(id))
	if fromDB == (model.Appointment{}) {
		c.Status(http.StatusBadRequest)
		return
	}
	a.AppointmentService.Save(item)
	c.JSON(http.StatusOK, item)
}

func (a *AppointmentAPI) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	fromDB := a.AppointmentService.FindByID(uint(id))
	if fromDB == (model.Appointment{}) {
		c.Status(http.StatusNotModified)
		return
	}
	a.AppointmentService.Delete(fromDB)
	c.Status(http.StatusNoContent)
}
