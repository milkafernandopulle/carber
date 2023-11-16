/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

type ImageSliderProps = {
  images: string[];
};
export default function ImageSlider({ images }: ImageSliderProps) {
  const displayImages = images?.length > 0 ? images : ["/images/vehicle-placeholder.avif"];

  return (
    <>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="w-full h-full [&_.swiper-button-next]:text-white [&_.swiper-button-next]:drop-shadow-lg [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:drop-shadow-lg">
        {displayImages.map((item) => (
          <SwiperSlide key={item}>
            <img className="block w-full h-full object-contain" src={item} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
