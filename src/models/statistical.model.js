import db from '../config/database.js';

export function getRevenueByService() {
  return db('services as s')
    .join('appointment_services as a', 's.service_id', 'a.service_id')
    .select(
      's.service_id',
      's.service_name',
      db.raw('SUM(s.base_price) as Revenue')
    )
    .groupBy('s.service_id')
    .orderBy('s.service_id');
}
