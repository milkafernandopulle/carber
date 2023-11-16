import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { clsx } from "clsx";
import Details from "./Details";
import { faker } from "@faker-js/faker";

async function getVehicle(vehicleId: number) {
  const result = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
    },
    include: {
      availabilities: true,
    },
  });
  return result;
}

async function getRelatedVehicles() {
  const result = await prisma.vehicle.findMany({
    where: {},
    select: {
      id: true,
      images: true,
      make: true,
      model: true,
      year: true,
      transmission: true,
      vehicleType: true,
    },
    take: 50,
  });

  const resultSlice = faker.helpers.arrayElements(result, { min: 1, max: 3 });

  return resultSlice;
}

type PageProps = {
  params: { id: string; tab?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ params }: PageProps) {
  const id = parseInt((params.id as string) || "0");

  if (!(id > 0)) {
    return notFound();
  }
  const [vehicle, relatedVehicles] = await Promise.all([getVehicle(id), getRelatedVehicles()]);
  if (!vehicle) {
    return notFound();
  }
  const reviews = generateReviews();

  return (
    <Details
      vehicle={vehicle}
      reviews={reviews}
      availabilities={vehicle.availabilities}
      relatedVehicles={relatedVehicles}
    />
  );
}

function generateReviews() {
  const reviewCount = faker.number.int({ min: 0, max: 6 });
  const featured = [];
  for (let index = 0; index < reviewCount; index++) {
    featured[index] = {
      id: index + 1,
      rating: faker.number.int({ min: 4, max: 5 }),
      content: `
          <p>${faker.helpers.arrayElement(reviewContents)}</p>
        `,
      author: faker.person.fullName(),
    } as any;
  }
  return {
    featured,
    average: featured.reduce((acc, review) => acc + review.rating, 0) / reviewCount,
  };
}

const reviewContents = [
  "Absolutely loved the car! Clean, comfortable, and a joy to drive.",
  "Smooth rental process from start to finish. The owner was responsive and accommodating.",
  "Perfect for our family road trip. Spacious, well-maintained, and great on gas!",
  "A reliable and well-maintained vehicle. The owner made the entire experience hassle-free.",
  "Fantastic owner and an equally fantastic car. Made our weekend getaway extra special.",
  "Highly recommended! The car exceeded expectations, and the owner was a pleasure to work with.",
  "Great communication with the owner. The car was in excellent condition and drove like a dream.",
  "Clean, comfortable, and fuel-efficient. Couldn't have asked for a better rental experience.",
  "Top-notch service! The car was spotless, and the owner went above and beyond to ensure our satisfaction.",
  "An excellent choice for a city adventure. Maneuvered through traffic with ease.",
  "The owner was friendly and accommodating. The car was exactly what we needed for our trip.",
  "Exceptional experience! The car was well-equipped, and the owner's attention to detail was evident.",
  "Five-star service! The car was clean, and the owner made pick-up and drop-off a breeze.",
  "Ideal for a weekend escape. Reliable, comfortable, and the owner was a pleasure to deal with.",
  "Efficient and reliable transportation. The owner's commitment to customer satisfaction was impressive.",
  "The car handled diverse terrains effortlessly. A great choice for an adventurous road trip!",
  "Perfect for a business trip. Clean, professional, and the owner was accommodating to my schedule.",
  "Exceptionally clean and well-maintained vehicle. The owner's commitment to quality is commendable.",
  "Great value for the money. The car exceeded expectations, and the owner was communicative.",
  "Superb rental experience! The car was in excellent condition, and the owner was responsive and helpful.",
  "Highly satisfied with the service. The car was clean, and the owner was a pleasure to work with.",
  "The owner was flexible and accommodating. The car made our vacation all the more enjoyable.",
  "Outstanding! The car was clean, comfortable, and the owner's communication was excellent.",
  "A reliable and stylish choice. The owner's professionalism and attention to detail were impressive.",
  "The car was in top-notch condition. The owner's commitment to customer satisfaction stood out.",
  "Highly recommend this car! The owner was friendly, and the vehicle exceeded expectations.",
  "Fantastic road trip experience! The car was reliable, and the owner's communication was excellent.",
  "The car owner was accommodating, and the vehicle was exactly what we needed for our trip.",
  "Clean and well-maintained car. The owner's professionalism added to the positive experience.",
  "Perfect for a family vacation. Spacious, comfortable, and the owner was accommodating.",
];
