import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import styles from "../styles/Home.module.css";

const totalSeats = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
];

export default function Home() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [disableSeatSelect, setDisableSeatSelect] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mobNumber, setMobNumber] = useState(0);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(
          `/api/bookings/${moment(date).format("DD-MM-YYYY")}`
        );
        if (data.message) {
          setSeats(totalSeats);
          return;
        }
        const bookedSeats = new Set([...data.bookedSeats]);
        const availableSeats = totalSeats.filter(
          (seat) => !bookedSeats.has(seat)
        );
        setSeats(availableSeats);
      } catch (error) {
        setMessage(
          "Unable to retreive flight data. Plese try after some time."
        );
      }
    })();
  }, [date]);

  const handleSeatSelect = (e) => {
    if ([...e.target.selectedOptions].length >= 6) setDisableSeatSelect(true);
    setSelectedSeats(
      [...e.target.selectedOptions].map((option) => option.value)
    );
  };

  const handleBookTicket = async (e) => {
    try {
      if (("" + mobNumber).length !== 10) {
        setMessage("Please check your mobile number.");
        return;
      }
      const { data: data1 } = await axios.put("/api/bookings", {
        seats: selectedSeats,
        flightDate: moment(date).format("DD-MM-YYYY"),
        mobNumber,
      });
      setModal(true);
      setMessage(
        `Your bookings has been confirmed with Id \n ${data1.bookingID} ${
          data1.flightDate
        } ${data1.seats.join(", ")}.`
      );
      const { data: data2 } = await axios.get(
        `/api/bookings/${moment(date).format("DD-MM-YYYY")}`
      );
      const bookedSeats = new Set([...data2.bookedSeats]);
      const availableSeats = totalSeats.filter(
        (seat) => !bookedSeats.has(seat)
      );
      setSeats(availableSeats);
      setSelectedSeats([]);
      setDisableSeatSelect(false);
    } catch (error) {
      setMessage(`Please try again.`);
      setSelectedSeats([]);
      setDisableSeatSelect(false);
    }
  };

  const handleModalButton = async () => {
    setModal(false);
    setMessage("");
    setMobNumber(0);
  };

  const changeDate = (e) => {
    setDate(e);
  };

  const changeMobNumber = (e) => {
    setMobNumber(e.target.value);
  };

  return modal ? (
    <div className={styles.container}>
      {message && (
        <div>
          <p>{message}</p>
        </div>
      )}
      <button onClick={handleModalButton}>Book More Tickets</button>
    </div>
  ) : (
    <div className={styles.container}>
      <h1>Book Tickets</h1>
      <div className={styles.flight_container}>
        <label htmlFor="date">Select Flight Date</label>
        <Calendar
          activeStartDate={new Date()}
          value={date}
          onChange={changeDate}
        />
      </div>
      <div className={styles.input_container}>
        <label>Enter your mobile number</label>
        <input
          type="number"
          value={mobNumber}
          onChange={changeMobNumber}
          maxLength="10"
        />
      </div>
      <div className={styles.seats_container}>
        <label htmlFor="seats">Select Seats</label>
        {seats.length > 0 && (
          <select
            disabled={disableSeatSelect}
            name="seats"
            size={seats.length + 1}
            multiple
            onChange={handleSeatSelect}
          >
            <option value="" disabled>
              available seats
            </option>
            {seats.map((seat) => (
              <option value={seat} key={seat}>
                {seat}
              </option>
            ))}
          </select>
        )}
      </div>
      {message && (
        <div>
          <p>{message}</p>
        </div>
      )}
      <div className={styles.button_container}>
        <button disabled={selectedSeats < 1} onClick={handleBookTicket}>
          Book tickets
        </button>
      </div>
    </div>
  );
}
