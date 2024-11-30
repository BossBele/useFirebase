import { Timestamp } from "firebase-admin/firestore";

type DateObject = {
  _seconds: number;
  _nanoseconds: number;
};

export function objectToDate(dateObject: Timestamp|DateObject): Date|void {
  const { _seconds: seconds, _nanoseconds: nanoseconds } = dateObject as DateObject;

  let dbDate;
  if (typeof seconds !== 'undefined') {
    dbDate = new Date((seconds ?? 0) * 1000 + (nanoseconds ?? 0) / 1000000);
  }
  if ('toDate' in dateObject) {
    dbDate = dateObject.toDate();
  }
  return dbDate;
}
