"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePriceAlertDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_price_alert_dto_1 = require("./create-price-alert.dto");
class UpdatePriceAlertDto extends (0, mapped_types_1.PartialType)(create_price_alert_dto_1.CreatePriceAlertDto) {
}
exports.UpdatePriceAlertDto = UpdatePriceAlertDto;
//# sourceMappingURL=update-price-alert.dto.js.map