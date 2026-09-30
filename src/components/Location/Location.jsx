import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { isOpenNow } from "../../utils/isOpenNow";
import "./Location.css";

const Location = () => {
  const { restaurantInfo } = useContext(StoreContext);
  if (!restaurantInfo) return null;

  const open = isOpenNow(restaurantInfo.openingHours);
  const social = restaurantInfo.socialLinks || {};

  const socialItems = [
    { key: "instagram", label: "Instagram", icon: "📷" },
    { key: "facebook", label: "Facebook", icon: "📘" },
    { key: "youtube", label: "YouTube", icon: "▶️" },
    { key: "whatsapp", label: "WhatsApp", icon: "💬" },
    { key: "twitter", label: "X", icon: "🐦" },
  ].filter((s) => social[s.key]);

  return (
    <section className="home-section location-section" id="location">
      <div className="section-header">
        <h2>Location & Hours</h2>
        <span className={`open-status ${open ? "open" : "closed"}`}>
          {open === null ? "" : open ? "Open Now" : "Closed"}
        </span>
      </div>
      <div className="location-grid">
        <div className="location-info">
          <div className="info-item">
            <strong>Address</strong>
            <p>{restaurantInfo.address}</p>
          </div>
          <div className="info-item">
            <strong>Phone</strong>
            <p><a href={`tel:${restaurantInfo.phone}`}>{restaurantInfo.phone}</a></p>
          </div>
          <div className="info-item">
            <strong>Email</strong>
            <p><a href={`mailto:${restaurantInfo.email}`}>{restaurantInfo.email}</a></p>
          </div>
          <div className="info-item">
            <strong>Opening Hours</strong>
            <ul className="hours-list">
              {restaurantInfo.openingHours?.map((h) => (
                <li key={h.day}>
                  <span>{h.day}</span>
                  <span>{h.isClosed ? "Closed" : `${h.open} - ${h.close}`}</span>
                </li>
              ))}
            </ul>
          </div>
          {restaurantInfo.googleMapsUrl && (
            <a
              href={restaurantInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-btn"
            >
              Get Directions
            </a>
          )}
          {socialItems.length > 0 && (
            <div className="location-social">
              {socialItems.map((s) => (
                <a
                  key={s.key}
                  href={social[s.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Location;
