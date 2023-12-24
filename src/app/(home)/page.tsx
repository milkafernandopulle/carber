/* eslint-disable @next/next/no-img-element */
import CTASection from "./CTASection";
import SearchForm from "./SearchForm";
import StatsSection from "./StatsSection";

export default function Home() {
  return (
    <>
      <div>
        <div className="absolute inset-x-0 -z-10 overflow-hidden top-0 h-screen" aria-hidden="true">
          <img src="/hero.jpg" alt="" className="relative w-full h-screen object-cover" />
        </div>
        <div className="relative isolate px-6  lg:px-8 min-h-[calc(100vh_-_64px_-_4rem)]">
          <div className="mx-auto max-w-4xl sm:py-2 lg:py-2">
            <div className="text-center space-y-3">
              <h1 className="text-4xl text-white font-bold tracking-tight sm:text-6xl">
                Rent A Car
              </h1>
              <p className="hidden md:block text-lg leading-8 text-gray-100">
                Search for a car to rent in your area. We have a wide selection of cars to choose
                from.
              </p>
              <div>
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatsSection />
      <CTASection />
    </>
  );
}
