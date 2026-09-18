import { styled } from "@mui/material";
import TextField from "@mui/material/TextField";

const CssTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "fieldRequired" // Exclude custom prop from being forwarded to DOM
})(({ fieldRequired, mode }) => ({
  marginBottom: "15px",
  "& label.Mui-focused": {
    color: mode == "dark" ? "#e6ebef" : "black",
    fontSize: "14px !important"
  },
  "& .MuiInputLabel-root": {
    color: mode == "dark" ? "#aab2b9" : "gray",
    fontSize: "14px !important"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#333333"
  },
  "& .MuiOutlinedInput-root": {
    color: "#a2a2a2",
    "& fieldset": {
      borderColor: fieldRequired ? "red" : "#333333"
    },
    "&:hover fieldset": {
      borderColor: fieldRequired ? "red" : "#a2a2a2"
    },
    "&.Mui-focused fieldset": {
      borderColor: fieldRequired ? "red" : "#6F7E8C"
    },
    "& input": {
      color: mode == "dark" ? "#aab2b9" : "black",
      fontSize: "14px !important",
      
    }
  }
}));

const CustomTextField = ({
  label,
  id = "",
  type = "text",
  value = "",
  onChange,
  size = "small",
  placeholder = "Enter your text",
  sx = {},
  fieldRequired = false,
  mode
}) => {
    mode = "white";
  
  return (
    <CssTextField
      fullWidth
      label={label}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      size="small"
      fieldRequired={fieldRequired}
      mode={mode}
      InputProps={{
        placeholder
      }}
    />
  );
};

export default CustomTextField;
