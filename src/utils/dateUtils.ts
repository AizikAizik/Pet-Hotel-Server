import moment from "moment";

export function getDifferenceInDays(date1: string, date2: string): number {
  const start = moment(date1);
  const end = moment(date2);

  return end.diff(start, "days");
}

export function getCurrentFormatedDate() {
  return moment().format("YYYY-MM-DD");
}

export function convertDateToIsoStringFormat(date: string | Date): string {
  return moment(new Date(date).toISOString()).format("YYYY-MM-DD");
}

export function validateCheckInDate(
  bookingDate: Date | string,
  currentDate: Date | string
): boolean {
  return (
    moment(new Date(bookingDate).toISOString()).isSame(
      new Date(currentDate).toISOString(),
      "date"
    ) ||
    moment(new Date(bookingDate).toISOString()).isAfter(
      new Date(currentDate).toISOString(),
      "date"
    )
  );
}

export function validateCheckOutDate(
  checkOutDate: string | Date,
  checkInDate: string | Date
): boolean {
  return moment(convertDateToIsoStringFormat(checkOutDate)).isAfter(
    convertDateToIsoStringFormat(checkInDate)
  );
}
//console.log(moment(new Date("2010-06-06").toISOString()).format("YYYY-MM-DD"));
//console.log(validateCheckInDate("2022-04-09T00:00:00.000+00:00", new Date()));
