import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import RatingDialog from "./RatingDialog";

const TempOrdersDialog = ({ open, onClose, tempOrders, onRemoveOrder }) => {

    const [expandedOrderIndex, setExpandedOrderIndex] = useState(null);
  const [orderType, setOrderType] = useState("delivery");
  const [orderQuantities, setOrderQuantities] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const { clientID } = useParams();

  const [deliveryGuys, setDeliveryGuys] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [otherInformation, setOtherInformation] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [showRateButton, setShowRateButton] = useState(false);
  const [rateButtonTimer, setRateButtonTimer] = useState(null);

  const handleDialogClose = () => {
    setSelectedLocation(null);
    onClose();
  };

  const handleRateUsClick = () => {
    clearTimeout(rateButtonTimer);
    setShowRateButton(false);
    setRatingDialogOpen(true);
  };

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  const handleSelectLocation = (event) => {
    const selectedLocationId = event.target.value;
    const selectedLocation = locations.find(
      (location) => location.id === selectedLocationId
    );
    setSelectedLocation(selectedLocation);

    // Update totalPrice with the selected location's price
    if (selectedLocation) {
      const newTotalPrice =
        tempOrders.reduce((total, order, index) => {
          const quantity = orderQuantities[index];
          return total + order.totalPrice * quantity;
        }, 0) + selectedLocation.price;
      setTotalPrice(newTotalPrice);
    }
  };

  useEffect(() => {
    if (tempOrders.length > 0) {
      let total = 0;
      tempOrders.forEach((order, index) => {
        const quantity = orderQuantities[index];
        total += order.totalPrice * quantity;
      });
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [orderQuantities, tempOrders]);

  const toggleExpand = (index) => {
    setExpandedOrderIndex(expandedOrderIndex === index ? null : index);
  };

  const handleOrderTypeClick = (type) => {
    if (type === "pickup") {
      // If changing to pickup, reset the selectedLocation and recalculate the totalPrice without the location price
      setSelectedLocation(null);
      const newTotalPrice = tempOrders.reduce((total, order, index) => {
        const quantity = orderQuantities[index];
        return total + order.totalPrice * quantity;
      }, 0);
      setTotalPrice(newTotalPrice);
    } else {
      // If changing to delivery, do nothing
    }
    setOrderType(type);
  };

  const handleQuantityChange = (event, index) => {
    const { value } = event.target;
    const newQuantities = [...orderQuantities];
    newQuantities[index] = parseInt(value) || 1;
    setOrderQuantities(newQuantities);
  };


  const handleOrder = () => {
    const pickupDateTime = `${pickupDate}T${pickupTime}`;
    if (orderType === "delivery") {
      const deliveryOrders = tempOrders.map((order, index) => ({
        ...order,
        quantity: orderQuantities[index],
      }));

      // Choose a random delivery guy
      const randomIndex = Math.floor(Math.random() * deliveryGuys.length);
      const randomDeliveryGuy = deliveryGuys[randomIndex];

      const deliveryData = {
        orders: deliveryOrders,
        totalPrice: totalPrice.toFixed(2),
        otherInformation: otherInformation,
        location: selectedLocation,
        clientId: clientID,
        orderType: "delivery",
        orderTime: pickupDateTime,
        deliveryGuy: randomDeliveryGuy,
        
      };
      console.log("Delivery Order Data:", deliveryData);

            
        setAlertMessage("Order added successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);

        setShowRateButton(true);
        const timer = setTimeout(() => {
          setShowRateButton(false);
        }, 3000);
        setRateButtonTimer(timer);
        onClose();
      {
        handleDialogClose();
      }
    } 
    
    else if (orderType === "pickup") {
      const pickupOrders = tempOrders.map((order, index) => ({
        ...order,
        quantity: orderQuantities[index],
      }));
      const pickupDateTime = `${pickupDate}T${pickupTime}`;
      
      const pickupData = {
        orders: pickupOrders,
        totalPrice: totalPrice.toFixed(2),
        orderTime: pickupDateTime,
        clientId: clientID,
        otherInformation: otherInformation,
        orderType: "pickup",
        token,
        claimed: false,
        
      };
      console.log("Pickup Order Data:", pickupData);

            

        for (const order of pickupOrders) {
         console.log(pickupOrders)

      }

        setAlertMessage("Order added successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
        setShowRateButton(true);
        setRateButtonTimer(timer);
        handleDialogClose();
        onClose();
      {
        handleDialogClose();
      }
    } 
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>Your Cart</DialogTitle>
        <DialogContent>
          {tempOrders.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              No Order Waiting
            </Typography>
          ) : (
            <>
              <Paper sx={{ p: 2 }}>
                <List>
                  {tempOrders.map((order, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ display: { xs: "block", sm: "flex" } }}>
                        <div style={{ width: "100%" }}>
                          <ListItemText
                            primary={
                              <Typography
                                fontWeight="bold"
                                textTransform={"capitalize"}
                                style={{ width: "100%" }}
                              >
                                {order.foodName} - GH₵{" "}
                                {order.totalPrice.toFixed(2)}
                              </Typography>
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 8,
                          }}
                        >
                          <TextField
                            sx={{ width: 100, marginRight: 1 }}
                            label="Quantity"
                            type="number"
                            size="small"
                            value={orderQuantities[index] || 1}
                            onChange={(e) => handleQuantityChange(e, index)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              min: 1,
                            }}
                          />
                          <IconButton
                            onClick={() => toggleExpand(index)}
                            style={{ marginRight: 1 }}
                          >
                            {expandedOrderIndex === index ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                          <IconButton onClick={() => onRemoveOrder(index)}>
                            <DeleteIcon color="warning" />
                          </IconButton>
                        </div>
                      </ListItem>
                      <AnimatePresence>
                        {expandedOrderIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ListItem>
                              <ListItemText
                                secondary={
                                  <>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                    >
                                      Toppings:
                                    </Typography>
                                    <ul>
                                      {order.toppings.map((topping, idx) => (
                                        <motion.li
                                          key={idx}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: 20 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          {topping.name} - GH₵{topping.price}
                                        </motion.li>
                                      ))}
                                    </ul>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                    >
                                      Instructions:{" "}
                                      <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: 0.1,
                                        }}
                                      >
                                        {order.instructions}
                                      </motion.span>
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {index < tempOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>

              <div style={{ margin: "10px 0" }}>
                <span
                  style={orderTypeStyle}
                  onClick={() => handleOrderTypeClick("delivery")}
                >
                  Delivery
                </span>
                <span
                  style={{
                    ...orderTypeStyle,
                    backgroundColor:
                      orderType === "pickup" ? "#6439ff" : "#fff",
                    color: orderType === "pickup" ? "#fff" : "#6439ff",
                  }}
                  onClick={() => handleOrderTypeClick("pickup")}
                >
                  Pickup
                </span>
              </div>

              {orderType === "delivery" && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                    Choose Destination
                  </Typography>
                  <Select
                    value={selectedLocation ? selectedLocation.id : ""}
                    onChange={handleSelectLocation}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name} - GH₵ {location.price}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {orderType === "pickup" && (
                <>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Pickup Date: {pickupDate}
                  </Typography>
                  <TextField
                    label="Select Pickup Time"
                    type="time"
                    value={pickupTime}
                    onChange={handleTimeChange}
                    fullWidth
                    size="small"
                    sx={{ my: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: pickupTime,
                    }}
                  />

                  <Alert severity="warning">
                    Order will be forfieted after 1 hour passed schedule
                  </Alert>
                </>
              )}

              <TextField
                label="Other information to locate you"
                fullWidth
                size="small"
                sx={{ mt: 1 }}
                value={otherInformation}
                onChange={(e) => setOtherInformation(e.target.value)}
              />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                Total: GH₵ {totalPrice.toFixed(2)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ShoppingCart />}
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
            variant="contained"
           
            disabled={orderType === "delivery" && !selectedLocation}
          >
            ORDER
          </Button>
        </DialogActions>
      </Dialog>
      {alertOpen && (
        <Alert
          severity={alertSeverity}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setAlertOpen(false)}
            >
              <CloseIcon />
            </Button>
          }
          sx={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            zIndex: 1500,
          }}
        >
          {alertMessage}
        </Alert>
      )}

      {showRateButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleRateUsClick}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1500,
          }}
        >
          Rate Us
        </Button>
      )}

      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
      />
    </>
  )
}

export default TempOrdersDialog
