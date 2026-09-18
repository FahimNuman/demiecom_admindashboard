const ColorSelector = ({ colors, selectedColors, setSelectedColors }) => {
  const handleColorSelection = (colorId) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  return (
    <div>
      <h5 className="font-medium mb-2">Select Colors</h5>
      <div className="flex flex-wrap gap-3">
        {colors?.map((color) => (
          <button
            key={color._id}
            type="button"
            onClick={() => handleColorSelection(color._id)}
            className={`px-3 py-1 rounded-md shadow-sm ${
              selectedColors?.includes(color._id)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
