// utils/text.ts

/**
 * Convert Thai text to English-like slug
 * Handles both Thai and English characters
 */
export function slugify(text: string): string {
    // Mapping of Thai characters to English (simplified approximation)
    const thaiToEnglishMap: Record<string, string> = {
      'ก': 'k', 'ข': 'kh', 'ฃ': 'kh', 'ค': 'kh', 'ฅ': 'kh', 'ฆ': 'kh',
      'ง': 'ng', 'จ': 'ch', 'ฉ': 'ch', 'ช': 'ch', 'ซ': 's', 'ฌ': 'ch',
      'ญ': 'y', 'ฎ': 'd', 'ฏ': 't', 'ฐ': 'th', 'ฑ': 'th', 'ฒ': 'th',
      'ณ': 'n', 'ด': 'd', 'ต': 't', 'ถ': 'th', 'ท': 'th', 'ธ': 'th',
      'น': 'n', 'บ': 'b', 'ป': 'p', 'ผ': 'ph', 'ฝ': 'f', 'พ': 'ph',
      'ฟ': 'f', 'ภ': 'ph', 'ม': 'm', 'ย': 'y', 'ร': 'r', 'ล': 'l',
      'ว': 'w', 'ศ': 's', 'ษ': 's', 'ส': 's', 'ห': 'h', 'ฬ': 'l',
      'อ': '', 'ฮ': 'h',
      'ะ': 'a', 'ั': 'a', 'า': 'a', 'ำ': 'am', 'ิ': 'i', 'ี': 'i',
      'ึ': 'ue', 'ื': 'ue', 'ุ': 'u', 'ู': 'u', 'เ': 'e', 'แ': 'ae',
      'โ': 'o', 'ใ': 'ai', 'ไ': 'ai',
      'ๅ': '', '็': '', '่': '', '้': '', '๊': '', '๋': '', '์': '',
      // Add more mappings as needed
    };
  
    // Replace Thai characters with English approximation
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (thaiToEnglishMap[char]) {
        result += thaiToEnglishMap[char];
      } else {
        result += char;
      }
    }
  
    // Standard slug transformation - 
    // Convert to lowercase, replace spaces with hyphens, 
    // remove special characters except alphanumeric and hyphens
    return result
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }