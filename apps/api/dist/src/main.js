"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const http_exception_filter_1 = require("./common/http-exception.filter");
const transform_interceptor_1 = require("./common/transform.interceptor");
const correlation_id_middleware_1 = require("./common/correlation-id.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const _realExit = process.exit.bind(process);
    process.exit = (code) => {
        console.error('process.exit called with code', code, new Error('exit stack').stack);
        return _realExit(code);
    };
    console.log('Bootstrapping Nest application...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    try {
        app.useLogger(app.get(nestjs_pino_1.Logger));
    }
    catch {
        console.warn('Logger setup failed, using default logger');
    }
    app.use((0, cookie_parser_1.default)());
    app.use(new correlation_id_middleware_1.CorrelationIdMiddleware().use);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Correlation-ID');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.status(200).end();
            return;
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const port = process.env.PORT ? Number(process.env.PORT) : 3001;
    console.log('Using PORT=', port);
    try {
        console.log('About to call app.listen...');
        await app.listen(port);
        console.log('app.listen resolved');
    }
    catch (err) {
        console.error('app.listen failed:', err);
        throw err;
    }
    console.log(`API listening on ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
    console.error('Application bootstrap failed:', err);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection:', reason);
});
process.on('SIGINT', () => {
    console.error('Received SIGINT');
});
process.on('SIGTERM', () => {
    console.error('Received SIGTERM');
});
process.on('beforeExit', (code) => {
    console.error('beforeExit with code', code);
});
process.on('exit', (code) => {
    console.error('exit with code', code);
});
//# sourceMappingURL=main.js.map