import prisma from "@/lib/prisma";
import SearchForm from "./SearchForm";
import { Prisma, Vehicle } from "@prisma/client";

import * as lodash from "lodash";
import SearchResults from "./SearchResults";

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

async function getSearchResults(searchQuery: Partial<Vehicle>) {
  const refinedSearchQuery = lodash.pickBy(searchQuery, (value) => !!value);

  if (refinedSearchQuery.year) {
    refinedSearchQuery.year = parseInt(refinedSearchQuery.year as string);
  }

  if (refinedSearchQuery.seats) {
    refinedSearchQuery.seats = parseInt(refinedSearchQuery.seats as string);
  }

  const results = await prisma.vehicle.findMany({
    where: {
      ...refinedSearchQuery,
    },
  });

  return results;
}

type PageProps = {
  searchParams: { [key: string]: string | undefined };
};
export default async function Page({ searchParams }: PageProps) {
  const searchMetaData = await getSearchMetaData();

  const results = await getSearchResults(searchParams);

  return (
    <>
      <div className="mx-auto max-w-6xl py-32 sm:py-2 lg:py-2 -mt-12">
        <SearchForm searchMetaData={searchMetaData} />
        <SearchResults results={results} />
      </div>
    </>
  );
}
