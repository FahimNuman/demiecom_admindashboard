import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { backend_url } from "../../App";
import { toast } from "react-toastify";
import { Backdrop, Box, Fade, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Cropper from "react-easy-crop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ListIcon from "@mui/icons-material/List";
import EditIcon from "@mui/icons-material/Edit";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 1200 },
  maxHeight: "90vh",
  bgcolor: "#fff",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  display: "flex",
  flexDirection: "column",
};

const cropModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 800 },
  maxHeight: "90vh",
  bgcolor: "#fff",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const listModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 1000 },
  maxHeight: "90vh",
  bgcolor: "#fff",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  display: "flex",
  flexDirection: "column",
};

const ProductFeatureListModal = ({ open, setOpen, setProductFeatures }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchFeatures = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${backend_url}/api/product-features/index`
          );
          if (response.data.status === "success") {
            setFeatures(response.data.data);
          } else {
            toast.error(
              "Failed to fetch product features: " + response.data.message
            );
          }
        } catch (error) {
          console.error("Error fetching product features:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
          toast.error(`An error occurred: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchFeatures();
    }
  }, [open]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${backend_url}/api/product-features/delete/${id}`
      );
      if (response.data.status === "success") {
        toast.success("Product feature deleted successfully");
        setFeatures((prev) => prev.filter((feature) => feature._id !== id));
        setProductFeatures((prev) =>
          prev.filter((feature) => feature._id !== id)
        );
      } else {
        toast.error(
          response.data.message || "Failed to delete product feature"
        );
      }
    } catch (error) {
      console.error("Error deleting product feature:", error);
      toast.error("An error occurred while deleting the product feature");
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={listModalStyle}>
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Product Features List
            </h2>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
            {loading ? (
              <p>Loading...</p>
            ) : features.length === 0 ? (
              <p>No product features found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature._id} className="border p-4 rounded-md">
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {feature.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Feature image ${index}`}
                          className="object-cover w-full h-24 rounded"
                        />
                      ))}
                      {feature.videos.map((video, index) => (
                        <video
                          key={index}
                          src={video.url}
                          controls
                          className="object-cover w-full h-24 rounded"
                        />
                      ))}
                    </div>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(feature._id)}
                      className="mt-2"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

const ProductFeatureModal = ({
  open,
  setOpen,
  handleClose,
  setProductFeatures,
}) => {
  const [previews, setPreviews] = useState([]);
  const [fileInputs, setFileInputs] = useState([0, 1, 2]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editImageIndex, setEditImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDimensions, setCropDimensions] = useState({
    width: 374,
    height: 390,
  });
  const imgRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  useEffect(() => {
    const subscription = watch((values) => {
      const newPreviews = [];
      fileInputs.forEach((index) => {
        const files = values[`files_${index}`];
        const height = parseInt(values[`height_${index}`]) || 390;
        if (files && files.length > 0) {
          const file = files[0];
          newPreviews.push({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video") ? "video" : "image",
            width: 374,
            height,
          });
        }
      });
      setPreviews(newPreviews);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, fileInputs, editModalOpen]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, []);

  const addMoreFileInput = () => {
    setFileInputs((prev) => [...prev, prev.length]);
  };

  const openEditModal = (index) => {
    if (previews[index]?.type === "image") {
      setEditImageIndex(index);
      setImageSrc(previews[index].url);
      setEditModalOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCropDimensions({
        width: 374,
        height: parseInt(watch(`height_${index}`)) || 390,
      });
      setCroppedAreaPixels(null);
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setImageSrc(null);
    setEditImageIndex(null);
    setCroppedAreaPixels(null);
  };

  const rotateImage = (direction) => {
    setRotation((prev) => (prev + (direction === "left" ? -90 : 90)) % 360);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = (imageSrc, pixelCrop, rotation, cropWidth, cropHeight) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Fill canvas with white to avoid transparent areas becoming black in JPEG
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Adjust canvas size based on rotation
        const isRotated90or270 = Math.abs(rotation % 180) === 90;
        canvas.width = isRotated90or270 ? cropHeight : cropWidth;
        canvas.height = isRotated90or270 ? cropWidth : cropHeight;

        // Center the canvas for rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Adjust draw position for rotated image
        const drawWidth = isRotated90or270 ? cropHeight : cropWidth;
        const drawHeight = isRotated90or270 ? cropWidth : cropHeight;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          (canvas.width - drawWidth) / 2,
          (canvas.height - drawHeight) / 2,
          drawWidth,
          drawHeight
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            const file = new File([blob], `cropped_image_${editImageIndex}.jpg`, {
              type: "image/jpeg",
            });
            resolve(file);
          },
          "image/jpeg",
          1
        );
      };
      image.onerror = () => reject(new Error("Image loading failed"));
    });
  };

  const saveEditedImage = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation,
          cropDimensions.width,
          cropDimensions.height
        );

        // Capture old URL before updating
        const oldUrl = previews[editImageIndex]?.url;

        setValue(`files_${editImageIndex}`, [croppedImage]);
        const newPreviewUrl = URL.createObjectURL(croppedImage);
        setPreviews((prev) =>
          prev.map((p, i) =>
            i === editImageIndex
              ? { ...p, url: newPreviewUrl, width: 374, height: cropDimensions.height }
              : p
          )
        );

        // Revoke old URL after update
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }

        closeEditModal();
      } catch (error) {
        console.error("Error cropping image:", error);
        toast.error("Failed to crop image");
      }
    } else {
      toast.error("No crop area selected");
    }
  };

  const removePreview = (index) => {
    const removedPreview = previews[index];
    setValue(`files_${index}`, null);
    setValue(`height_${index}`, 390);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (removedPreview) {
      URL.revokeObjectURL(removedPreview.url);
    }
  };

  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    fileInputs.forEach((index) => {
      if (data[`files_${index}`] && data[`files_${index}`][0]) {
        formDataToSend.append("files", data[`files_${index}`][0]);
        formDataToSend.append(`width_${index}`, 374);
        if (data[`height_${index}`])
          formDataToSend.append(`height_${index}`, data[`height_${index}`]);
      }
    });

    try {
      const response = await axios.post(
        `${backend_url}/api/product-features/add`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === "success") {
        toast.success("Product feature created/updated successfully");
        setProductFeatures((prevFeatures) => {
          const existingIndex = prevFeatures.findIndex(
            (feat) => feat._id === response.data.data._id
          );
          if (existingIndex >= 0) {
            const updatedFeatures = [...prevFeatures];
            updatedFeatures[existingIndex] = response.data.data;
            return updatedFeatures;
          }
          return [...prevFeatures, response.data.data];
        });
        setOpen(false);
        reset();
        setPreviews([]);
        setFileInputs([0, 1, 2]);
      } else {
        toast.error(
          response.data.message || "Failed to create product feature"
        );
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the product feature"
      );
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Create Product Feature
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  startIcon={<ListIcon />}
                  onClick={() => setListModalOpen(true)}
                >
                  View Features
                </Button>
                <IconButton
                  onClick={handleClose}
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="overflow-y-auto px-6 py-4 space-y-4 flex-1"
              encType="multipart/form-data"
            >
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images or Videos (At least 3 images/videos required to
                  create a post)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fileInputs.map((index) => (
                    <div key={index} className="flex flex-col">
                      <label
                        htmlFor={`files-upload-${index}`}
                        className="h-48 flex flex-col justify-center items-center gap-2 border border-dashed border-gray-400 rounded-lg text-center transition hover:border-blue-500"
                      >
                        <span className="text-sm text-gray-600">
                          Click to upload image or video
                        </span>
                        <input
                          type="file"
                          id={`files-upload-${index}`}
                          name={`files_${index}`}
                          accept="image/jpeg,image/png,video/mp4,video/webm"
                          className="hidden"
                          disabled={!!previews[index]}
                          {...register(`files_${index}`)}
                        />
                      </label>
                      <div className="mt-2 flex gap-2 items-center">
                        <div className="w-1/2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Width
                          </label>
                          <input
                            type="text"
                            value="374"
                            disabled
                            className="w-full px-2 py-1 border rounded-md bg-gray-100"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Height
                          </label>
                          <input
                            type="number"
                            {...register(`height_${index}`, {
                              min: 100,
                              max: 2000,
                            })}
                            defaultValue={390}
                            placeholder="Image Height (px)"
                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              const newHeight = parseInt(e.target.value) || 390;
                              setValue(`height_${index}`, newHeight);
                              if (previews[index]) {
                                setPreviews((prev) =>
                                  prev.map((p, i) =>
                                    i === index
                                      ? { ...p, height: newHeight, width: 374 }
                                      : p
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                      {previews[index] && (
                        <div className="mt-2 w-full h-auto border rounded-lg overflow-hidden relative">
                          {previews[index].type === "image" ? (
                            <img
                              src={previews[index].url}
                              alt={`Preview ${index}`}
                              className="object-cover w-full"
                              style={{
                                width: `374px`,
                                height: `${previews[index].height}px`,
                              }}
                            />
                          ) : (
                            <video
                              src={previews[index].url}
                              controls
                              className="object-cover w-full"
                              style={{
                                width: `374px`,
                                height: `${previews[index].height}px`,
                              }}
                            />
                          )}
                          <div className="absolute top-1 right-1 flex gap-1">
                            {previews[index].type === "image" && (
                              <IconButton
                                size="small"
                                onClick={() => openEditModal(index)}
                                className="!bg-green-500/30 backdrop-blur-md text-green-700 rounded-full p-1 shadow-sm hover:!bg-green-500/40"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => removePreview(index)}
                              className="!bg-red-500/30 backdrop-blur-md text-red-700 rounded-full p-1 shadow-sm hover:!bg-red-500/40"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={addMoreFileInput}
                  className="mt-2"
                >
                  Add More
                </Button>
              </div>
              <div className="px-6 py-3 border-t bg-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting || previews.length < 3}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Create Product Feature"}
                </button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <Fade in={editModalOpen}>
          <Box sx={cropModalStyle}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Image</h2>
              <IconButton
                onClick={closeEditModal}
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            {imageSrc ? (
              <>
                <div className="relative w-full h-[500px]">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={374 / (cropDimensions.height || 390)}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    restrictPosition={false}
                    style={{
                      containerStyle: { width: "100%", height: "100%" },
                    }}
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Crop Height
                  </label>
                  <input
                    type="number"
                    value={cropDimensions.height}
                    onChange={(e) => {
                      const newHeight = parseInt(e.target.value) || 390;
                      setCropDimensions({
                        ...cropDimensions,
                        height: newHeight,
                      });
                      setValue(`height_${editImageIndex}`, newHeight);
                    }}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Crop Height (px)"
                  />
                </div>
              </>
            ) : (
              <p>
                Error: Image source not available. Check console for details.
              </p>
            )}
            <div className="flex justify-between gap-2 mt-4">
              <Button
                variant="outlined"
                startIcon={<RotateLeftIcon />}
                onClick={() => rotateImage("left")}
              >
                Rotate Left
              </Button>
              <Button
                variant="outlined"
                startIcon={<RotateRightIcon />}
                onClick={() => rotateImage("right")}
              >
                Rotate Right
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={saveEditedImage}
              >
                Save
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <ProductFeatureListModal
        open={listModalOpen}
        setOpen={setListModalOpen}
        setProductFeatures={setProductFeatures}
      />
    </>
  );
};

export default ProductFeatureModal;