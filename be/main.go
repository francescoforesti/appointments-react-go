package main

import (
	"github.com/francescoforesti/appointments/be/logging"
	"github.com/francescoforesti/appointments/be/model"
	"github.com/francescoforesti/appointments/be/repository"
	routers "github.com/francescoforesti/appointments/be/rest"
	service "github.com/francescoforesti/appointments/be/service"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	//"gorm.io/driver/postgres"
	//"gorm.io/gorm"
)

var (
	router *gin.Engine
)

func initDB() *gorm.DB {
	dsn := "host=0.0.0.0 user=postgres password=postgres dbname=appointments port=5432 sslmode=disable TimeZone=Europe/Rome"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	_ = db.AutoMigrate(&model.Appointment{})
	return db
}

func main() {
	logging.Init()
	db := initDB()
	//defer db.Close()

	repo := repository.CreateRepository(db)
	serv := service.CreateService(repo)

	gin.SetMode(gin.DebugMode)
	router = gin.Default()
	router.Use(CORS())
	routers.Init(router, serv)
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
