function initializeSwaggger(app) {
    const swaggerUi = require("swagger-ui-express")
    const swaggerDocument = require("../swagger.json")
    const options = {
        swaggerOptions: {
            plugins: [
                function () {
                    return {
                        statePlugins: {
                            spec: {
                                wrapSelectors: {
                                    allowTryItOutFor: () => () => false,
                                },
                            },
                        },
                    }
                },
            ],
        },
    }
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

    console.log("Swagger initialized")
}

module.exports = { initializeSwaggger }
