import CloseIcon from "@mui/icons-material/Close";
import {
    Backdrop,
    Box,
    Button,
    Divider,
    Fade,
    Grid,
    IconButton,
    Modal,
    Typography,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Adjusted modal style with flex to position submit button at bottom-right
const lightStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: 400, md: 1200 },
    height: { xs: "60vh", md: "70vh" },
    bgcolor: "#fff",
    border: "2px solid #1f1f1f",
    borderRadius: 2,
    p: 3,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
};

const OrderItemModal = ({ open, handleClose, selectOrder }) => {

    // console.log("selectOrder", selectOrder);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backdropFilter: "blur(5px)",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                },
            }}
        >
            <Fade in={open}>
                <Box sx={lightStyle}>
                    {/* Modal Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Order Item</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ marginY: 2 }} />

                    {/* Modal Body */}
                    <Box sx={{ flexGrow: 1, overflowY: "auto" }}>


                        <TableContainer sx={{ marginTop: 2 }} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>SKU</TableCell>
                                        <TableCell>Color</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectOrder && selectOrder.orderProducts?.length > 0 &&
                                        selectOrder.orderProducts.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Avatar alt="Product Image" src={data.url || "/static/images/avatar/1.jpg"} />
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.productId?.name}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.productId?.sku}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.colorId?.name}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.sizeId?.name}</Typography>
                                                    </Box>
                                                </TableCell>

                                               

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.quantity}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.price}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">{data?.quantity * data?.price}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                    </Box>

                    <Divider sx={{ marginY: 2 }} />
 
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderItemModal;