import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

const Slideshow = () => {
  const [topFoods, setTopFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageClick = (food) => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFood(null);
  };
  return (
    <div className="container">
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      }}
      pagination={{ el: ".swiper-pagination", clickable: true }}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        clickable: true,
      }}
      modules={[EffectCoverflow, Pagination, Navigation]}
      className="swiper_container"
    >
      {topFoods.map((food) => (
        <SwiperSlide key={food.id}>
          <Box
            className="slide-content"
            onClick={() => handleImageClick(food)}
          >
            <img src={food.image} alt={food.name} />
            <Typography variant="h6" className="food-name">
              {food.name}
            </Typography>
          </Box>
        </SwiperSlide>
      ))}

      <div className="slider-controler">
        <div className="swiper-button-prev slider-arrow">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </div>
        <div className="swiper-button-next slider-arrow">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </Swiper>

    {selectedFood && (
      <FoodDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title={selectedFood.name}
        rating={selectedFood.rating}
        price={selectedFood.price}
        imageSrc={selectedFood.image}
        description={selectedFood.description}
        id={selectedFood.id}
      />
    )}
  </div>
  )
}

export default Slideshow
