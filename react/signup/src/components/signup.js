import React, { useEffect, useState } from "react";
import { Container, Form, Input, Button } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
export const Home = () => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [countryId, setCountryId] = useState(0);
  useEffect(() => {
    countrydata();
  }, []);
  useEffect(() => {
    if (countryId) {
      statedata(countryId);
    }
  }, [countryId]);
  const countrydata = () => {
    fetch("http://127.0.0.1:8000/api/getcountry", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCountryData(data);
      });
  };
  const statedata = (countryId) => {
    fetch(`http://127.0.0.1:8000/api/getstate/${countryId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStateData(data);
      });
  };
  return (
    <>
      <Container className="w-75 m-auto">
        <h1 className="mb-5 text-center">Login</h1>
        <Form>
          <Input className="mb-3" name="fname" placeholder="First Name" type="text" />
          <Input className="mb-3" name="lname" placeholder="Last Name" type="text" />
          <Input className="mb-3" name="email" placeholder="Email" type="email" />
          <Input className="mb-3" type="select" onChange={(e) => setCountryId(e.target.value)}>
            <option>Select Country</option>
            {countryData.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </Input>
          <Input className="mb-3" type="select">
            <option>Select State</option>
            {stateData.map((state) => (
              <option key={state.id}>{state.name}</option>
            ))}
          </Input>
          <Button>Submit</Button>
        </Form>
      </Container>
    </>
  );
};