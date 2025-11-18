export const formatDistance = (distance) => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(1) + " km"; // 5.1 km
  }
  return Math.round(distance) + " m"; // < 1 km
};

