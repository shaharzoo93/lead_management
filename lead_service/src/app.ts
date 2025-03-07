import { Application } from 'express';
import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import 'express-async-errors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { LeadController } from './controllers/leadController';
import { CommonController } from './controllers/commonController';
import { ErrorHandlerMiddleware } from './common/exception-middleware/error-handler';
import cors from 'cors';
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.app.use(cors())
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next();
    });
    this.initializePreMiddlewares();
    this.setControllers();
    // this.setupSwagger();
    this.healthCheck();
    this.initializePostMiddlewares();
  }

  private initializePreMiddlewares() {
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(helmet());
    this.app.disable('x-powered-by');
  }

  private setControllers() {
    const commonController = Container.get(CommonController);
    const leadController = Container.get(LeadController);

    // Telling express to use our Controller's routes
    this.app.use('/api/v1/common', commonController.router);
    this.app.use('/api/v1/leads', leadController.router);

    commonController.CreateAllTableIfNotExistAsync();
  }

  private initializePostMiddlewares() {
    this.app.use(ErrorHandlerMiddleware.ErrorHandler);
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

  private healthCheck() {
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

export default new App().app;
