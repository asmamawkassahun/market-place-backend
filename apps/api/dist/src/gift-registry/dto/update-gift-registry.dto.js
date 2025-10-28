"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGiftRegistryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_gift_registry_dto_1 = require("./create-gift-registry.dto");
class UpdateGiftRegistryDto extends (0, mapped_types_1.PartialType)(create_gift_registry_dto_1.CreateGiftRegistryDto) {
}
exports.UpdateGiftRegistryDto = UpdateGiftRegistryDto;
//# sourceMappingURL=update-gift-registry.dto.js.map