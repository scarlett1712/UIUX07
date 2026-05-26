export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  // Expect YYYY-MM-DD
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  return dateStr; // fallback
};
