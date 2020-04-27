import React from "react";
import { Card } from "react-native-elements";

const ErrorMessage = ({ message }) => {
  const renderMessage = () => {
    if (typeof message === "string") return <li>{message}</li>;

    let errorMessages = [];
    message.forEach((item) => {
      for (let props in item.constraints)
        errorMessages.push(item.constraints[props]);
    });

    return errorMessages.map((errorMessage, idx) => (
      <li key={idx}>{errorMessage}</li>
    ));
  };

  return (
    <div>
      <Card style={{ backgroundColor: "#f7c5c0", marginBottom: "20px" }}>
        <CardBody>
          <h3>Oops!!</h3>
          <ul>{renderMessage()}</ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default ErrorMessage;
