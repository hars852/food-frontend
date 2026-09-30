import React from "react";
import Header from "../../components/Header/Header";
import PopularDishes from "../../components/PopularDishes/PopularDishes";
import TodaysSpecial from "../../components/TodaysSpecial/TodaysSpecial";
import Offers from "../../components/Offers/Offers";
import About from "../../components/About/About";
import Gallery from "../../components/Gallery/Gallery";
import Reviews from "../../components/Reviews/Reviews";
import Location from "../../components/Location/Location";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <PopularDishes />
      <TodaysSpecial />
      <Offers />
      <About />
      <Gallery />
      <Reviews />
      <Location />
      <AppDownload />
    </div>
  );
};

export default Home;
