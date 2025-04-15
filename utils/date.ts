// utils/date.ts
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    // Thai month names
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    // Convert to Buddhist era (BE) by adding 543 years
    const buddhistYear = date.getFullYear() + 543;
    
    // Format as day month year (Thai style)
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${buddhistYear}`;
  }