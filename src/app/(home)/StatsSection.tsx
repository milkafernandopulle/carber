/* eslint-disable @next/next/no-img-element */
const stats = [
  { id: 1, name: "Vehicles", value: "400+" },
  { id: 2, name: "Flat Platform fee", value: "3%" },
  { id: 3, name: "Trips", value: "2800+" },
  { id: 4, name: "Help and Support", value: "24x7" },
];

export default function StatsSection() {
  return (
    <div className="relative bg-white">
      <img
        className="h-56 w-full bg-gray-50 object-cover lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/2"
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
        alt=""
      />
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="px-6 pb-24 pt-16 sm:pb-32 sm:pt-20 lg:col-start-2 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg">
            <h2 className="text-base font-semibold leading-8 text-indigo-600">Our track record</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by thousands of users&nbsp; in UK
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Embark on your journey with confidence by choosing from our extensive range of
              high-quality rental cars. Whether you&apos;re seeking the convenience of a compact car
              for urban adventures, the spacious comfort of an SUV for family road trips, or the
              elegance of a luxury vehicle for a special occasion, our fleet has you covered. With a
              commitment to providing top-notch vehicles, we ensure that each car in our selection
              is meticulously maintained, thoroughly inspected, and ready to meet your travel needs.
              Discover the perfect ride for your next adventure and enjoy a seamless rental
              experience with our reliable and diverse fleet.
            </p>
            <dl className="mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mt-16">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                  <dt className="text-sm leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
