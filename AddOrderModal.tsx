// AddOrderDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
  IconButton,

} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import OrderPlace from "../Hooks/OrderManage";
import StatusDialog from "./StatusDialog";
// import { useState } from "react";

interface AddOrderDialogProps {
  open: boolean;
  onClose: () => void;
   refetch: () => void;
}

type FormValues = {
  accId: number;
  shareId: number;
  qty: number;
  orderType: string;
  exchange: string;
  priceType: string;
  limitPrice?: number|null;
};

export default function AddOrderDialog({ open, onClose,refetch }: AddOrderDialogProps) {
  const {
    control,
    handleSubmit,
    watch,reset,
    formState: { errors },
  } = useForm<FormValues>();

const [statusDialogOpen, setStatusDialogOpen] = useState(false);
const [statusMessage, setStatusMessage] = useState("");
const [statusType, setStatusType] = useState<"success" | "error">("success");

  const priceType = watch("priceType");

  const onSubmit = (data: FormValues) => {
  
     const parsedData = {
    ...data,
    accId: Number(data.accId),
    shareId: Number(data.shareId),
    qty: Number(data.qty),
    limitPrice: data.limitPrice ? Number(data.limitPrice) : null,
  };
  console.log("Submitted Data:", parsedData);
   
    onClose();
    OrderPlace(parsedData)
  .then(() => {
    setStatusType("success");
    setStatusMessage("Order placed successfully!");
    setStatusDialogOpen(true);
    
  })
  .catch((err) => {
   let message = "Something went wrong";

if (err?.response?.data) {
  if (typeof err.response.data === "string") {
    message = err.response.data; // your actual server message
  } else if (err.response.data.message) {
    message = err.response.data.message;
  }
} else if (err?.message) {
  message = err.message;
}
    setStatusType("error");
    setStatusMessage(message);
    setStatusDialogOpen(true);
    
  });}
  useEffect(() => {
  if (!open) {
    reset(); 
  }
}, [open, reset]);

  return (
      <>
      <Dialog open={open} onClose={(_, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
        onClose();
      }
    }} fullWidth maxWidth="xs">
      <DialogTitle sx={{backgroundColor:'#4361ee',color:'#fff'}}>Add New Order<IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton></DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2} p={1}>
          <Controller
            name="accId"
            control={control}
            rules={{ required: "Account Id is required" }}
            render={({ field }) => (
              <TextField
                label="Account Id"
                 type="number"
                fullWidth
                {...field}
                error={!!errors.accId}
                helperText={errors.accId?.message}
                  sx={{overflow:'visible'}}
              />
            )}
          />
          <Controller
            name="shareId"
            control={control}
            rules={{ required: "Share Id is required" }}
            render={({ field }) => (
              <TextField
                label="Share Id"
                fullWidth
                 type="number"
                {...field}
                error={!!errors.shareId}
                helperText={errors.shareId?.message}
                sx={{overflow:'visible'}}
              />
            )}
          />
          <Controller
            name="exchange"
            control={control}
            rules={{ required: "Exchange is required" }}
            render={({ field }) => (
              <TextField
                select
                label="Exchange"
                fullWidth
                {...field}
                error={!!errors.exchange}
                helperText={errors.exchange?.message}
                  sx={{overflow:'visible'}}
              >
                <MenuItem value="NSE">NSE</MenuItem>
                <MenuItem value="BSE">BSE</MenuItem>
              </TextField>
            )}
          /><Controller
            name="qty"
            control={control}
            rules={{ required: "Quantity is required" }}
            render={({ field }) => (
              <TextField
                label="Quantity"
                fullWidth
                type="number"
                {...field}
                error={!!errors.qty}
                helperText={errors.qty?.message}
                  sx={{overflow:'visible'}}
              />
            )}
          />
          <Controller
            name="priceType"
            control={control}
            rules={{ required: "Price Type is required" }}
            render={({ field }) => (
              <TextField
                select
                label="Price Type"
                fullWidth
                {...field}
                error={!!errors.priceType}
                helperText={errors.priceType?.message}
                  sx={{overflow:'visible'}}
              >
                <MenuItem value="Market">Market</MenuItem>
                <MenuItem value="Limit">Limit</MenuItem>
              </TextField>
            )}
          />
          {priceType === "Limit" && (
            <Controller
              name="limitPrice"
              control={control}
              rules={{ required: "Limit Price is required for Limit orders" }}
              render={({ field }) => (
                <TextField
                  label="Limit Price"
                  type="number"
                  fullWidth
                  {...field}
                  error={!!errors.limitPrice}
                  helperText={errors.limitPrice?.message}
                    sx={{overflow:'visible'}}
                />
              )}
            />
          )}
         <Controller
  name="orderType"
  control={control}
  rules={{ required: "Order Type is required" }}
  render={({ field }) => (
    <>
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={field.value}
        onChange={(_, value) => field.onChange(value)}
        sx={{
          display: 'flex',
          border:errors.orderType?'1px solid #d32f2f':'1px solid #ccc',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ToggleButton
          value="Buy"
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            border: 'none',
            '&.Mui-selected': {
              bgcolor: '#4361ee',
              color: 'white',
              '&:hover': {
                bgcolor: '#3341bb',
              },
            },
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          Buy
        </ToggleButton>
        <ToggleButton
          value="Sell"
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            border: 'none',
            '&.Mui-selected': {
              bgcolor: '#f57c00',
              color: 'white',
              '&:hover': {
                bgcolor: '#e65100',
              },
            },
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          Sell
        </ToggleButton>
      </ToggleButtonGroup>

      {errors.orderType && (
  <p style={{ color: '#d32f2f', fontSize: '0.88rem', marginLeft: ' 14px ',marginTop:'-10px' }}>
    {errors.orderType.message}
  </p>
)}
    </>
  )}
/>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  variant="outlined"
  color="error">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} sx={{ backgroundColor: '#4361ee' }}>
          Place
        </Button>
      </DialogActions>
    </Dialog>

    <StatusDialog
  open={statusDialogOpen}
  onClose={() => setStatusDialogOpen(false)}
  message={statusMessage}
  type={statusType}
  refetch={refetch}
/>
      </>
  );
}
