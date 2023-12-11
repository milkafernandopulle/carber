import prisma from "@/lib/prisma";
import SearchForm from "./SearchForm";
import { Prisma, Vehicle } from "@prisma/client";

import * as lodash from "lodash";
import SearchResults from "./SearchResults";
import { addDays, format, parse } from "date-fns";
import { redirect } from "next/navigation";

async function getSearchMetaData() {
  const [makeAndModel, year, transmission, seats, vehicleType] = await Promise.all(
    [["make", "model"], "year", "transmission", "seats", "vehicleType"].map((col) =>
      prisma.vehicle.groupBy({
        by: col as Prisma.VehicleScalarFieldEnum,
        orderBy: (Array.isArray(col)
          ? col.map((c) => ({ [c]: "asc" }))
          : { [col]: "asc" }) as Prisma.VehicleOrderByWithAggregationInput,
      })
    )
  );

  return {
    makeAndModel: makeAndModel.reduce((acc, { make, model }) => {
      const newAcc = {
        ...acc,
        [make]: [...(((acc as any)[make] as any) || []), model],
      };
      return newAcc;
    }, {}),
    year: year.map(({ year }) => year),
    transmission: transmission.map(({ transmission }) => transmission),
    seats: seats.map(({ seats }) => seats),
    vehicleType: vehicleType.map(({ vehicleType }) => vehicleType),
  };
}

type VehicleSearchQuery = Omit<Partial<Vehicle>, "images">;
type AvailabilitySearchQuery = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};
type LocationSearchQuery = {
  postcode: string;
  distance: number;
};

type SearchQuery = VehicleSearchQuery & AvailabilitySearchQuery & LocationSearchQuery;
async function getSearchResults(searchQuery: SearchQuery) {
  const availabilityQueryKeys = ["startDate", "endDate", "startTime", "endTime"];
  const locationQueryKeys = ["postcode", "distance"];
  const vehicleQueryKeys = [
    "make",
    "model",
    "fuel",
    "transmission",
    "vehicleType",
    "seats",
    "engine",
    "color",
    "allowedMilage",
    "year",
    "published",
  ];

  const refinedSearchQuery = lodash.pickBy(searchQuery, (value) => !!value);

  const availabilityQuery = lodash.pick(
    refinedSearchQuery,
    ...availabilityQueryKeys
  ) as AvailabilitySearchQuery;

  if (
    !availabilityQuery.startDate ||
    !availabilityQuery.startTime ||
    !availabilityQuery.endDate ||
    !availabilityQuery.endTime
  ) {
    const start = addDays(new Date(), 1);
    const end = addDays(new Date(), 2);

    const params = new URLSearchParams({
      startDate: format(start, "yyyy-MM-dd"),
      startTime: "10.00AM",
      endDate: format(end, "yyyy-MM-dd"),
      endTime: "10.00AM",
    });

    redirect("/search?" + params.toString());
  }

  const vehicleQuery = lodash.pick(refinedSearchQuery, ...vehicleQueryKeys) as VehicleSearchQuery;

  const locationQuery = lodash.pick(
    refinedSearchQuery,
    ...locationQueryKeys
  ) as LocationSearchQuery;

  if (vehicleQuery.year) {
    vehicleQuery.year = parseInt(vehicleQuery.year as unknown as string);
  }

  if (vehicleQuery.seats) {
    vehicleQuery.seats = parseInt(vehicleQuery.seats as unknown as string);
  }

  let lte = parse(
    availabilityQuery.startDate + " " + availabilityQuery.startTime,
    "yyyy-MM-dd hh.mmaa",
    new Date()
  );

  let gte = parse(
    availabilityQuery.endDate + " " + availabilityQuery.endTime,
    "yyyy-MM-dd hh.mmaa",
    new Date()
  );

  let availabilities = {
    some: {
      AND: [
        {
          from: {
            lte,
          },
        },
        {
          to: {
            gte,
          },
        },
      ],
    },
  };

  let locationClause = {} as any;
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${locationQuery.postcode}`);

    if (res.status === 200) {
      const { result } = await res.json();

      const distance = (parseInt(locationQuery.distance as any) || 10) * 1.60934;
      const {
        lat: [latGte, latLte],
        long: [longGte, longLte],
      } = insideGeo(result.longitude, result.latitude, distance);

      locationClause = {
        locationLat: {
          gte: latGte,
          lte: latLte,
        },
        locationLong: {
          gte: longGte,
          lte: longLte,
        },
      };
    }
  } catch {
    console.log("Invalid postcode");
    return [];
  }

  const results = await prisma.vehicle.findMany({
    where: {
      ...vehicleQuery,
      availabilities,
      adminApproved: true,
      ...locationClause,
    },
  });

  return results;
}

type PageProps = {
  searchParams: { [key: string]: string | undefined };
};
export default async function Page({ searchParams }: PageProps) {
  const searchMetaData = await getSearchMetaData();

  const results = await getSearchResults(searchParams as unknown as SearchQuery);

  return (
    <>
      <div className="mx-auto max-w-6xl py-32 sm:py-2 lg:py-2 -mt-12 h-[calc(100vh_-_64px)]">
        <SearchForm searchMetaData={searchMetaData} />
        <SearchResults results={results} />
      </div>
    </>
  );
}

function insideGeo(long: number, lat: number, distance: number) {
  const earthRadius = 6371;
  const latRadius = distance / earthRadius;
  const longRadius = distance / (earthRadius * Math.cos((Math.PI * lat) / 180));
  return {
    lat: [lat - latRadius, lat + latRadius],
    long: [long - longRadius, long + longRadius],
  };
}
