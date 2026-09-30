import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";
import "./Reservation.css";

const Reservation = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState({ name: "", phone: "", email: "", date: "", time: "", guests: 2, tablePreference: "Any", specialRequest: "" });
  const change = (event) => setData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); try { const response = await axios.post(`${url}/api/reservation/book`, data, token ? { headers: { token } } : undefined); if (!response.data.success) throw new Error(response.data.message); toast.success(`Table booked. Confirmation: ${response.data.data.confirmationNumber}`); setData({ name: "", phone: "", email: "", date: "", time: "", guests: 2, tablePreference: "Any", specialRequest: "" }); } catch (error) { toast.error(error.response?.data?.message || error.message || "Could not book your table"); } };
  return <main className="reservation-page"><section className="reservation-card"><div><h1>Book a Table</h1><p>Reserve your table and we’ll make your visit special.</p></div><form onSubmit={submit}><input required name="name" value={data.name} onChange={change} placeholder="Your name"/><input required name="phone" value={data.phone} onChange={change} placeholder="Phone number"/><input required type="email" name="email" value={data.email} onChange={change} placeholder="Email address"/><input required type="date" name="date" min={new Date().toISOString().slice(0, 10)} value={data.date} onChange={change}/><input required type="time" name="time" value={data.time} onChange={change}/><select name="guests" value={data.guests} onChange={change}>{[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select><select name="tablePreference" value={data.tablePreference} onChange={change}><option>Any</option><option>Indoor</option><option>Outdoor</option><option>Window</option></select><textarea name="specialRequest" value={data.specialRequest} onChange={change} placeholder="Special request (optional)"/><button type="submit">Confirm Reservation</button></form></section></main>;
};
export default Reservation;
