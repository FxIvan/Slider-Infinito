export const handleFinalPositon = (value, division) => {
  const remainder = value % division;
  return remainder < 0 ? remainder + division : remainder;
};
