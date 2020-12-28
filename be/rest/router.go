package routers

import (
	"github.com/francescoforesti/appointments/be/logging"
	"github.com/francescoforesti/appointments/be/service"
	"github.com/francescoforesti/appointments/be/utils"
	"github.com/gin-gonic/gin"
)

func Init(router *gin.Engine, service service.AppointmentService) {

	router.RedirectTrailingSlash = true
	router.RedirectFixedPath = true

	contextPath := utils.GetEnv(utils.CONTEXT_PATH_ENV, utils.CONTEXT_PATH)
	api := router.Group(contextPath)

	logging.Debug("Creating routes " + contextPath + "...")

	handler := CreateAPI(service)

	api.POST("/appointments", handler.Create)
	api.GET("/appointments", handler.FindAll)
	api.GET("/calendar/appointments", handler.FindAllCalendar)
	api.GET("/appointments/:id/", handler.FindOne)
	api.DELETE("/appointments/:id/", handler.Delete)
	api.PUT("/appointments/:id/", handler.Update)

	err := router.Run(utils.GetEnv(utils.SERVER_PORT_ENV, utils.SERVER_PORT))
	if err != nil {
		panic(err)
	}
}
