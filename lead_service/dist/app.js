"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const typedi_1 = __importDefault(require("typedi"));
require("express-async-errors");
const helmet_1 = __importDefault(require("helmet"));
const leadController_1 = require("./controllers/leadController");
const commonController_1 = require("./controllers/commonController");
const error_handler_1 = require("./common/exception-middleware/error-handler");
const cors_1 = __importDefault(require("cors"));
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.app.use((req, res, next) => {
            next();
        });
        this.initializePreMiddlewares();
        this.setControllers();
        // this.setupSwagger();
        this.healthCheck();
        this.initializePostMiddlewares();
    }
    initializePreMiddlewares() {
        this.app.use(body_parser_1.default.json({ limit: '50mb' }));
        this.app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
        this.app.use((0, helmet_1.default)());
        this.app.disable('x-powered-by');
    }
    setControllers() {
        const commonController = typedi_1.default.get(commonController_1.CommonController);
        const leadController = typedi_1.default.get(leadController_1.LeadController);
        // Telling express to use our Controller's routes
        this.app.use('/api/v1/common', commonController.router);
        this.app.use('/api/v1/leads', leadController.router);
        commonController.CreateAllTableIfNotExistAsync();
    }
    initializePostMiddlewares() {
        this.app.use(error_handler_1.ErrorHandlerMiddleware.ErrorHandler);
    }
    // private setupSwagger() {
    //   const swaggerOptions = {
    //     definition: {
    //       openapi: '3.0.0',
    //       info: {
    //         title: 'Your API',
    //         version: '1.0.0',
    //         description: 'Description of your API',
    //       },
    //     },
    //     apis: ['./src/controllers/*.ts'], // Update this to the path where your controller routes are located
    //   };
    //   const swaggerSpec = swaggerJsdoc(swaggerOptions);
    //   // Expose an endpoint to download the Swagger JSON
    //   this.app.get('/swagger/json', (req, res) => {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(swaggerSpec);
    //   });
    //   this.app.use('/swagger/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // }
    healthCheck() {
        // Expose an endpoint to check service health check
        this.app.get('/api/v1/health', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            const data = {
                uptime: process.uptime(),
                message: 'Ok',
                date: new Date(),
            };
            res.status(200).send(data);
        });
    }
}
exports.default = new App().app;
