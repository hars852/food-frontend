import React, { useContext, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ImageModal from "../ImageModal/ImageModal";
import "./Gallery.css";

const CATEGORIES = ["all", "food", "restaurant", "events", "chef"];

const Gallery = () => {
  const { gallery, url, loading } = useContext(StoreContext);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);

  const filtered = filter === "all"
    ? gallery
    : gallery.filter((g) => g.category === filter);

  if (!loading && gallery.length === 0) return null;

  return (
    <section className="home-section gallery-section" id="gallery">
      <div className="section-header">
        <h2>Gallery</h2>
      </div>
      <div className="gallery-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingSpinner message="Loading gallery..." />
      ) : filtered.length === 0 ? (
        <p className="gallery-empty">No images in this category</p>
      ) : (
        <div className="gallery-grid">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="gallery-item"
              onClick={() => setModal({ src: `${url}/images/${item.image}`, title: item.title })}
            >
              <img src={`${url}/images/${item.image}`} alt={item.title} />
              <div className="gallery-overlay">
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <ImageModal src={modal?.src} title={modal?.title} onClose={() => setModal(null)} />
    </section>
  );
};

export default Gallery;
