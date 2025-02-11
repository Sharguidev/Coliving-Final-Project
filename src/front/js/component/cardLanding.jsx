import "../../styles/anguibell.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const PropertyCard = ({ property }) => {
  return (
    <div
      className="p-2 col-3 col-md-4 col-lg-3 col-sm-12 col-12"
      style={{
        minHeight: "550px",
      }}
    >
      <Link
        to={"/hostProperty/" + property.id}
        className="text-decoration-none text-black"
      >
        <div className="card flex flex-column h-100 cardLanding">
          <img
            src={property.files}
            style={{
              height: "250px",
              objectFit: "cover",
              width: "100%",
            }}
            className="card-img-top"
            alt="Imagen de la propiedad"
          />
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "start",
              padding: "1rem",
              flex: 1,
            }}
          >
            <h5 className="card-title">{property.name}</h5>
            <p>
              {property.description.length > 40
                ? `${property.description.substring(0, 37)}...`
                : property.description}
            </p>
            <p>
              {property.rooms_number} habitaciones - {property.beds} camas -{" "}
              {property.restrooms} baños
            </p>
            <p>
              <strong>${property.price}</strong>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CardsLanding = () => {

  const { store, actions } = useContext(Context)
  const [show, setShow] = useState(false)
  const itemsPerPage = 12
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentData, setCurrentData] = useState([])
  
  useEffect(()=> {
    if (store.properties) {
      if (store.properties.length <= itemsPerPage) {
        setCurrentData(store.properties);
        setShow(false);
      } else {
        setTotalPages(Math.ceil(store.properties.length / itemsPerPage));
        setCurrentData(
          store.properties.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        );
        setShow(true);
      }
    }
  }, [store.properties, currentPage]);
  console.log(currentData);
  return (
    <>
      <div className="m-5">
        <div className="container">
          <div className="row">
            {currentData.map((item, index) => {
              return <PropertyCard property={item} key={index} />;
            })}
          </div>
          <button
            className={
              show
                ? `siguiente-card d-flex justify-content-center rounded px-5 py-3 mb-4`
                : "d-none"
            }
            onClick={() =>
              setCurrentPage(currentPage == totalPages ? 1 : currentPage + 1)
            }
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default CardsLanding;
