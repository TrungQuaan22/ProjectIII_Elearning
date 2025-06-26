import { Review } from "src/types/review.type";

export function roundToNearestHalf(value: number): number {

    const integerPart = Math.floor(value); 
    const decimalPart = value - integerPart; 
  
    if (decimalPart >= 0 && decimalPart < 0.5) {
      return integerPart;
    } else if (decimalPart >= 0.5 && decimalPart < 1) {
      return integerPart + 0.5;
    }
    return value;
  }
export const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 700,
  cssEase: 'ease-in-out',
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: false,
  draggable: false,
  useTransform: true,
  swipeToSlide: true,
  touchThreshold: 15,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}
export function handleListReview(reviews: Review[] | undefined) {
  if (!reviews || reviews.length === 0) {
    return { totalReviews: 0, averageRating: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return {
    totalReviews: reviews.length,
    averageRating: parseFloat(averageRating.toFixed(2)),
  };
}
export const getImagePrefix = () => {
  return process.env.NODE_ENV === "production"
    ? '/E-learning/'
    : ''
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString('vi-VN') + 'đ'
}

