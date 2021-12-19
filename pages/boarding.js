import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import styles from "../styles/Home.module.css";

export default function Boarding() {
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(
          `/api/bookings/${moment(date).format("DD-MM-YYYY")}`
        );
        if (data.message) {
          setMessage(data.message);
          setBookings([]);
          return;
        }
        console.log(data);
        setBookings(data.bookings);
      } catch (error) {
        setMessage(
          "Unable to retreive flight data. Plese try after some time."
        );
      }
    })();
  }, [date]);

  const changeDate = (e) => {
    setDate(e);
  };

  return (
    <div className={styles.container}>
      <h1>Boardings</h1>
      <div className={styles.flight_container}>
        <label htmlFor="date">Select Flight Date</label>
        <Calendar
          activeStartDate={new Date()}
          value={date}
          onChange={changeDate}
        />
      </div>
      {message && <p>{message}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Seq No.</th>
            <th>Booking ID</th>
            <th>Seats</th>
            <th>Mobile Number</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 &&
            bookings.map((booking, i) => (
              <tr key={booking.bookingID}>
                <td>{i + 1}</td>
                <td>{booking.bookingID}</td>
                <td>{booking.seats.join(", ")}</td>
                <td>{booking.mobNumber}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
