import moment from "moment";

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD for api call
}

export function formatedDate(date: Date): string {
  const formattedDate = moment(date).format("MMMM D, YYYY h:mm A");
  return formattedDate;
}
