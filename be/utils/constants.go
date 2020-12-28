package utils

import "os"

const (
	SERVER_PORT_ENV          string = "SERVER_PORT"
	SERVER_PORT              string = ":8080"
	LOG_LEVEL_ENV_VAR        string = "DEFAULT_LOG_LEVEL"
	DEFAULT_LOG_LEVEL        string = "DEBUG"
	KAFKA_BROKER_ADDRESS_ENV string = "KAFKA_BROKER_ADDRESS"
	KAFKA_BROKER_ADDRESS     string = "127.0.0.1:9092"
	KAFKA_TOPIC_ENV          string = "KAFKA_TOPIC"
	KAFKA_TOPIC              string = "appointments"
	CONTEXT_PATH_ENV         string = "context-path"
	CONTEXT_PATH             string = "api/v1"
)

func GetEnv(prop string, defaultProp string) string {
	value := os.Getenv(prop)
	if len(value) == 0 {
		value = defaultProp
	}
	return value
}
