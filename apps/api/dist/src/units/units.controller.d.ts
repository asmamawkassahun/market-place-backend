import { UnitsService } from './units.service';
export declare class UnitsController {
    private readonly service;
    constructor(service: UnitsService);
    perUnitDisplay(unit: string, ppcu: string): {
        display: string;
    };
}
