import fs from "fs";
import allBookings from "../../data/bookingsData.json";

function saveBooking() {
  fs.writeFileSync(
    "./data/bookingsData.json",
    JSON.stringify(allBookings, null, 2)
  );
}

export default function handler(req, res) {
  const {
    method,
    body: { seats, flightDate, mobNumber },
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json({ allBookings });
      break;
    case "PUT":
      const newObj = {
        bookingID: parseInt(Math.random() * 999999),
        flightDate,
        seats: seats.sort(
          (a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1))
        ),
        mobNumber,
      };

      if (allBookings.length === 0) {
        allBookings.push({
          flightDate,
          bookings: [newObj],
          bookedSeats: [...seats],
        });
        saveBooking();
        return res.status(200).json(newObj);
      } else {
        for (let i in allBookings) {
          if (allBookings[i].flightDate === newObj.flightDate) {
            allBookings[i].bookedSeats.push(...seats);
            allBookings[i].bookings.push(newObj);
            allBookings[i].bookings.sort(
              (a, b) =>
                parseInt(b.seats[0].substring(1)) -
                parseInt(a.seats[0].substring(1))
            );
            saveBooking();
            return res.status(200).json(newObj);
          }
        }
        allBookings.push({
          flightDate,
          bookings: [newObj],
          bookedSeats: [...seats],
        });
        saveBooking(flightDate, seats);
        return res.status(200).json(newObj);
      }
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
