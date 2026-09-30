import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "../Auth/AuthPages.css";

const ProfilePage = () => {
  const { customer } = useContext(StoreContext);
  return <main className="profile-card"><h1>Your profile</h1><p><strong>Name</strong><br />{customer?.name || "Loading?"}</p><p><strong>Email</strong><br />{customer?.email || "Loading?"}</p></main>;
};
export default ProfilePage;
