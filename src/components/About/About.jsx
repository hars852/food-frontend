import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./About.css";

const About = () => {
  const { restaurantInfo } = useContext(StoreContext);
  const about = restaurantInfo?.about || {};

  return (
    <section className="home-section about-section" id="about">
      <div className="about-content">
        <div className="about-text">
          <h2>About {restaurantInfo?.name || "Our Restaurant"}</h2>
          <p className="about-intro">{about.introduction}</p>
          <p className="about-story">{about.story}</p>
          <p className="about-quality"><strong>Our Promise:</strong> {about.quality}</p>
          {about.highlights?.length > 0 && (
            <ul className="about-highlights">
              {about.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
          <a href="#location" className="learn-more-btn">Learn More</a>
        </div>
      </div>
    </section>
  );
};

export default About;
