import { Vehicle } from "@prisma/client";
import ResultsGrid from "./ResultsGrid";

type SearchResultsProps = {
  results: Vehicle[];
};
export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <>
      <div className="my-10">
        {results.length === 0 ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">No results found</h1>
            <p className="mt-4 text-gray-500">Try adjusting your search filters.</p>
          </div>
        ) : (
          <ResultsGrid results={results} />
        )}
      </div>
    </>
  );
}
