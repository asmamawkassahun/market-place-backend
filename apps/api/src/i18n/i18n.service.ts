import { Injectable } from '@nestjs/common';

@Injectable()
export class I18nService {
  t(key: string, locale = 'am') {
    // Placeholder translations
    const dict: Record<string, Record<string, string>> = {
      am: { hello: 'ሰላም' },
      en: { hello: 'Hello' },
    };
    return dict[locale]?.[key] ?? key;
  }
}


