import { useState, useEffect } from "react";

const SizeSelector = ({ selectedColors, sizes, colors, colorImages, setColorImages, register, setValue, initialData }) => {
  const [sizeData, setSizeData] = useState({});

  useEffect(() => {
    setSizeData((prevSizeData) => {
      const updatedSizeData = { ...prevSizeData };
      selectedColors.forEach((colorId) => {
        if (updatedSizeData[colorId]) return; // Skip if already initialized

        const colorData = initialData?.colors?.find((c) => c._id === colorId) || { sizes: [] };
        updatedSizeData[colorId] = {};
        sizes.forEach((size) => {
          const sizeInfo = colorData.sizes.find((s) => s.size === size._id) || {
            price: 0,
            costPrice: 0,
            quantity: 0,
            lowQuantity: 0,
          };
          updatedSizeData[colorId][size._id] = {
            price: sizeInfo.price,
            costPrice: sizeInfo.costPrice,
            quantity: sizeInfo.quantity,
            lowQuantity: sizeInfo.lowQuantity,
            selected: colorData.sizes.some((s) => s.size === size._id),
          };
          // Initialize form fields only for new colors
          if (!prevSizeData[colorId]) {
            setValue(`sizes_${colorId}`, colorData.sizes.map((s) => s.size));
            setValue(`price_${colorId}_${size._id}`, sizeInfo.price || 0);
            setValue(`costPrice_${colorId}_${size._id}`, sizeInfo.costPrice || 0);
            setValue(`quantity_${colorId}_${size._id}`, sizeInfo.quantity || 0);
            setValue(`lowQuantity_${colorId}_${size._id}`, sizeInfo.lowQuantity || 0);
          }
        });
      });
      return updatedSizeData;
    });
  }, [selectedColors, sizes, initialData, setValue]);

  const handleImageUpload = (event, colorId) => {
    const files = event.target.files;
    setColorImages((prevImages) => ({
      ...prevImages,
      [colorId]: [...(prevImages[colorId] || []), ...files],
    }));
  };

  const removeImage = (colorId, index) => {
    setColorImages((prevImages) => ({
      ...prevImages,
      [colorId]: prevImages[colorId].filter((_, i) => i !== index),
    }));
  };

  const handleCheckboxChange = (colorId, sizeId, field, value) => {
    setSizeData((prev) => {
      const updatedSizeData = {
        ...prev,
        [colorId]: {
          ...prev[colorId],
          [sizeId]: {
            ...prev[colorId][sizeId],
            [field]: value,
          },
        },
      };
      // If deselecting the size, reset all fields to 0
      if (field === "selected" && !value) {
        updatedSizeData[colorId][sizeId].price = 0;
        updatedSizeData[colorId][sizeId].costPrice = 0;
        updatedSizeData[colorId][sizeId].quantity = 0;
        updatedSizeData[colorId][sizeId].lowQuantity = 0;
        setValue(`price_${colorId}_${sizeId}`, 0);
        setValue(`costPrice_${colorId}_${sizeId}`, 0);
        setValue(`quantity_${colorId}_${sizeId}`, 0);
        setValue(`lowQuantity_${colorId}_${sizeId}`, 0);
      } else if (field === "selected" && value) {
        // Restore initial values when selecting, but preserve user changes
        const sizeInfo = (initialData?.colors?.find((c) => c._id === colorId)?.sizes || []).find((s) => s.size === sizeId) || {
          price: 0,
          costPrice: 0,
          quantity: 0,
          lowQuantity: 0,
        };
        updatedSizeData[colorId][sizeId].price = updatedSizeData[colorId][sizeId]?.price || sizeInfo.price || 0;
        updatedSizeData[colorId][sizeId].costPrice = updatedSizeData[colorId][sizeId]?.costPrice || sizeInfo.costPrice || 0;
        updatedSizeData[colorId][sizeId].quantity = updatedSizeData[colorId][sizeId]?.quantity || sizeInfo.quantity || 0;
        updatedSizeData[colorId][sizeId].lowQuantity = updatedSizeData[colorId][sizeId]?.lowQuantity || sizeInfo.lowQuantity || 0;
        setValue(`price_${colorId}_${sizeId}`, updatedSizeData[colorId][sizeId].price);
        setValue(`costPrice_${colorId}_${sizeId}`, updatedSizeData[colorId][sizeId].costPrice);
        setValue(`quantity_${colorId}_${sizeId}`, updatedSizeData[colorId][sizeId].quantity);
        setValue(`lowQuantity_${colorId}_${sizeId}`, updatedSizeData[colorId][sizeId].lowQuantity);
      }
      return updatedSizeData;
    });
    // Update the corresponding react-hook-form field
    if (field === "selected") {
      const currentSizes = value
        ? [...(prev[colorId]?.selectedSizes || []), sizeId]
        : (prev[colorId]?.selectedSizes || []).filter((id) => id !== sizeId);
      setValue(`sizes_${colorId}`, currentSizes);
    } else {
      setValue(`${field}_${colorId}_${sizeId}`, value);
    }
  };

  const handleRowCheckbox = (colorId, field, checked) => {
    const values = sizes.map((size) => sizeData[colorId]?.[size._id]?.[field] || 0);
    const valueToApply = values.find((v) => v > 0) || 0;

    sizes.forEach((size) => {
      if (sizeData[colorId]?.[size._id]?.selected) {
        setSizeData((prev) => ({
          ...prev,
          [colorId]: {
            ...prev[colorId],
            [size._id]: {
              ...prev[colorId][size._id],
              [field]: checked ? valueToApply : 0,
            },
          },
        }));
        setValue(`${field}_${colorId}_${size._id}`, checked ? valueToApply : 0);
      }
    });
  };

  return (
    <>
      {selectedColors?.map((colorId) => (
        <div key={colorId} className="mt-4">
          <h5 className="font-medium">
            Sizes for {colors?.find((c) => c._id === colorId)?.name}
          </h5>
          <div className="max-w-full gap-3 flex flex-nowrap">
            <div className="flex flex-col gap-1">
              <div className="h-10"></div>
              <div className="flex items-center gap-2 h-8">
                <input
                  type="checkbox"
                  onChange={(e) => handleRowCheckbox(colorId, "price", e.target.checked)}
                  className="w-4 h-4"
                />
               
              </div>
              <div className="flex items-center gap-2 h-8">
                <input
                  type="checkbox"
                  onChange={(e) => handleRowCheckbox(colorId, "costPrice", e.target.checked)}
                  className="w-4 h-4"
                />
              
              </div>
              <div className="flex items-center gap-2 h-8">
                <input
                  type="checkbox"
                  onChange={(e) => handleRowCheckbox(colorId, "quantity", e.target.checked)}
                  className="w-4 h-4"
                />
              
              </div>
              <div className="flex items-center gap-2 h-8">
                <input
                  type="checkbox"
                  onChange={(e) => handleRowCheckbox(colorId, "lowQuantity", e.target.checked)}
                  className="w-4 h-4"
                />
              
              </div>
            </div> 
            {sizes?.map((size) => (
              <div key={size._id}>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2 text-sm h-10">
                    <input
                      type="checkbox"
                      {...register(`sizes_${colorId}`)}
                      value={size._id}
                      checked={sizeData[colorId]?.[size._id]?.selected || false}
                      onChange={(e) => handleCheckboxChange(colorId, size._id, "selected", e.target.checked)}
                      className="w-4 h-4"
                    />
                    {size.name}
                  </label>
                  <input
                    type="number"
                    {...register(`price_${colorId}_${size._id}`)}
                    value={sizeData[colorId]?.[size._id]?.price || ''}
                    placeholder="Price"
                    onChange={(e) => handleCheckboxChange(colorId, size._id, "price", parseFloat(e.target.value) || 0)}
                    disabled={!sizeData[colorId]?.[size._id]?.selected}
                    className="px-2 py-1 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm w-full h-8 disabled:bg-gray-100"
                  />
                  <input
                    type="number"
                    {...register(`costPrice_${colorId}_${size._id}`)}
                    value={sizeData[colorId]?.[size._id]?.costPrice || ''}
                    placeholder="Cost Price"
                    onChange={(e) => handleCheckboxChange(colorId, size._id, "costPrice", parseFloat(e.target.value) || 0)}
                    disabled={!sizeData[colorId]?.[size._id]?.selected}
                    className="px-2 py-1 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm w-full h-8 disabled:bg-gray-100"
                  />
                  <input
                    type="number"
                    {...register(`quantity_${colorId}_${size._id}`)}
                    value={sizeData[colorId]?.[size._id]?.quantity || ''}
                    placeholder="Quantity"
                    onChange={(e) => handleCheckboxChange(colorId, size._id, "quantity", parseFloat(e.target.value) || 0)}
                    disabled={!sizeData[colorId]?.[size._id]?.selected}
                    className="px-2 py-1 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm w-full h-8 disabled:bg-gray-100"
                  />
                  <input
                    type="number"
                    {...register(`lowQuantity_${colorId}_${size._id}`)}
                    value={sizeData[colorId]?.[size._id]?.lowQuantity || ''}
                    placeholder="Low Quantity"
                    onChange={(e) => handleCheckboxChange(colorId, size._id, "lowQuantity", parseFloat(e.target.value) || 0)}
                    disabled={!sizeData[colorId]?.[size._id]?.selected}
                    className="px-2 py-1 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm w-full h-8 disabled:bg-gray-100"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <h5 className="font-medium">
              Images for {colors?.find((c) => c._id === colorId)?.name}
            </h5>
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 inline-block mt-2">
              Select Images
              <input
                type="file"
                multiple
                onChange={(e) => handleImageUpload(e, colorId)}
                className="hidden"
              />
            </label>
            <div className="showImage" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {colorImages[colorId]?.map((image, index) => {
                const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);
                return (
                  <div key={index} style={{ position: "relative", display: "inline-block" }}>
                    <img src={imageUrl} alt={`Upload Preview ${index}`} width="100" height="100" />
                    <button
                      onClick={() => removeImage(colorId, index)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "red",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                      }}
                    >
                      ❌
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SizeSelector;