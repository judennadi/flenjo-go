import { Star, StarHalf, StarBorder } from "@mui/icons-material";
import { useState } from "react";

const labels = {
  1: "Useless",
  2: "Poor",
  3: "Ok",
  4: "Good",
  5: "Excellent",
};

// ====================== Display rating ======================
export const StarRating = ({ value, size }) => {
  // let value = 3.5;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      stars.push(
        <li key={i}>
          <Star style={{ color: "orange" }} fontSize={size} />
        </li>
      );
    } else if (!Number.isInteger(value) && i === Math.ceil(value)) {
      stars.push(
        <li key={i}>
          <StarHalf style={{ color: "orange" }} fontSize={size} />
        </li>
      );
    } else {
      stars.push(
        <li key={i}>
          <StarBorder style={{ color: "orange" }} fontSize={size} />
        </li>
      );
    }
  }

  return (
    <div style={{ display: "inline-block", width: "auto" }}>
      <ul
        style={{ display: "inline-flex", gap: "5px", width: "auto", padding: "2px 0 0", listStyle: "none" }}
      >
        {stars}
      </ul>
    </div>
  );
};

// ====================== Add rating ======================
export const AddStarRating = ({ size }) => {
  const [value, setValue] = useState(0);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      stars.push(
        <li key={i} style={{ cursor: "pointer" }} onClick={() => setValue(i)}>
          <Star style={{ color: "orange" }} fontSize={size} />
        </li>
      );
    } else {
      stars.push(
        <li key={i} style={{ cursor: "pointer" }} onClick={() => setValue(i)}>
          <StarBorder style={{ color: "orange" }} fontSize={size} />
        </li>
      );
    }
  }

  return (
    <div style={{ display: "inline-block", width: "auto" }}>
      <ul
        style={{
          display: "inline-flex",
          gap: "5px",
          width: "auto",
          padding: "0",
          alignItems: "center",
          listStyle: "none",
        }}
      >
        {stars}
        <li>{value !== null && <p style={{ fontWeight: "500" }}>{labels[value]}</p>}</li>
      </ul>
    </div>
  );
};
