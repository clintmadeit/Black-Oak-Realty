import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function formatNumber(num) {
  return num >= 1e6
    ? (num / 1e6).toFixed(1) + "M"
    : num.toLocaleString("en-US");
}

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[260px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt={listing.title}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 ease-in-out"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <h2 className="text-lg text-egyptianblue font-semibold mt-2 truncate">
            {listing.title}
          </h2>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-neonorange" />
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-egyptianblue mt-2 font-semibold">
            Ksh{" "}
            {formatNumber(
              listing.offer ? listing.discountedPrice : listing.regularPrice
            )}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-neonorange flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-neonorange text-white text-center font-semibold p-1 rounded-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </div>
            {listing.offer && (
              <div className="bg-egyptianblue text-white text-center font-semibold p-1 rounded-md">
                Ksh{" "}
                {formatNumber(+listing.regularPrice - +listing.discountedPrice)}{" "}
                OFF!
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

ListingCard.propTypes = {
  listing: PropTypes.object.isRequired,
};
