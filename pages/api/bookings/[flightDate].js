import fs from "fs";

function getAllBookings() {
  return fs.readFileSync("./data/bookingsData.json", {
    encoding: "utf8",
    flag: "r",
  });
}

export default function handler(req, res) {
  const {
    query: { flightDate },
    method,
  } = req;

  switch (method) {
    case "GET":
      const allBookings = JSON.parse(getAllBookings());

      for (let booking of allBookings) {
        if (booking.flightDate === flightDate) {
          const { bookings, bookedSeats } = booking;
          return res.status(200).json({ bookings, bookedSeats });
        }
      }

      return res
        .status(200)
        .json({ message: "flight does not have any bookings." });
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
