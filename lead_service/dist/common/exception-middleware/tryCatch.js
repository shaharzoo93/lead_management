"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = void 0;
const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res);
    }
    catch (error) {
        return next(error);
    }
};
exports.tryCatch = tryCatch;
