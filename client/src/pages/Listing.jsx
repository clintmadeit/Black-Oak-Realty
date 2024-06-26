import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import axios from "axios";
import { FadeLoader } from "react-spinners";
import { MdHotelClass } from "react-icons/md";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [workAddress, setWorkAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [durationInTraffic, setDurationInTraffic] = useState("");
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.listing.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data.listing);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  function formatNumber(num) {
    return num >= 1e6
      ? (num / 1e6).toFixed(1) + "M"
      : num.toLocaleString("en-US");
  }

  const handleCalculateDistance = async () => {
    try {
      const response = await axios.post("/api/calculateDistanceAndTraffic", {
        workAddress,
        listingCoordinates: listing.coordinates, // Assuming listing.coordinates is an object { lat, lng }
      });
      setDistance(response.data.distance);
      setDurationInTraffic(response.data.durationInTraffic);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "75vh",
            width: "100vw",
          }}
        >
          <FadeLoader color="#f49d19" size={15} />
        </div>
      )}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: `cover`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-egyptianblue"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl text-egyptianblue font-semibold">
              {listing.title} - Ksh{" "}
              {formatNumber(
                listing.offer ? listing.discountedPrice : listing.regularPrice
              )}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-egyptianblue" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-neonorange w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent"
                  ? "For Rent"
                  : listing.type === "sale"
                  ? "For Sale"
                  : "Hotel Room"}
              </p>
              {listing.offer && (
                <p className="bg-egyptianblue w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  Ksh{" "}
                  {formatNumber(
                    +listing.regularPrice - +listing.discountedPrice
                  )}{" "}
                  OFF!
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-egyptianblue">
                Description -{" "}
              </span>
              {listing.description}
            </p>
            <ul className="text-egyptianblue font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                {listing.type === "hotel" && (
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <MdHotelClass className="text-lg" />
                    {listing.roomClass && `${listing.roomClass} `}
                  </div>
                )}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              {listing.type === "rent" ||
                (listing.type === "sale" && (
                  <>
                    <li className="flex items-center gap-1 whitespace-nowrap ">
                      <FaParking className="text-lg" />
                      {listing.parking ? "Parking spot" : "No Parking"}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap ">
                      <FaChair className="text-lg" />
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </li>
                  </>
                ))}
            </ul>

            <div className="mt-4">
              <p className="text-gray-700 text-xs sm:text-sm font-semibold">
                This logic helps you determine the estimate distance from your
                work place to the location of the property. It may also estimate
                the traffic situation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                placeholder="Enter your work address"
                value={workAddress}
                onChange={(e) => setWorkAddress(e.target.value)}
                className="px-3 py-2 border border-neonorange rounded-md focus:outline-none focus:ring-2 focus:ring-egyptianblue w-full sm:w-auto"
              />
              <button
                onClick={handleCalculateDistance}
                className="px-4 py-2  text-white bg-egyptianblue rounded-md hover:opacity-95 w-full sm:w-auto"
              >
                Calculate
              </button>
              {distance && durationInTraffic && (
                <div className="mt-4">
                  <p className="text-indigo-500 font-semibold">
                    Distance from work: {distance} km
                  </p>
                  <p className="text-indigo-500 font-semibold">
                    Duration in traffic: {durationInTraffic}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between sm:space-x-2 mt-4">
              <Link
                to={`/create-booking/${listing._id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block bg-egyptianblue text-white font-semibold py-2 px-4 rounded-lg hover:bg-neonorange transition-colors duration-200 ease-in-out text-center"
              >
                {listing.type === "rent" || listing.type === "sale"
                  ? "Book Your Viewing"
                  : "Book Your Stay"}
              </Link>
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="inline-block bg-neonorange text-white font-semibold py-2 px-4 rounded-lg hover:bg-egyptianblue transition-colors duration-200 ease-in-out text-center"
                  >
                    Make Inquiry
                  </button>
                )}
            </div>
            {contact && <Contact listing={listing} />}
          </div>
          <Footer />
        </>
      )}
    </main>
  );
}
