import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';
function FormComponent() {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userAgreement: false,
  });
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [filteredRegions, setFilteredRegions] = useState([]);
  useEffect(() => {
    // Fetch countries from REST Countries API
    fetch('http://127.0.0.1:8000/api/countries')
      .then((response) => response.json())
      .then((data) => {
        console.log('Countries:', data);
        if (data && Array.isArray(data)) {
          setCountries(data);
        }
      })
      .catch((error) => console.error(error));
    // Fetch regions from Countries API
    fetch('http://127.0.0.1:8000/api/regions')
      .then((response) => response.json())
      .then((data) => {
        console.log('Regions:', data);
        if (data && Array.isArray(data)) {
          setRegions(data);
        }
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    // Filter the regions based on the selected country
    const filteredRegions = regions.filter(
      (region) => region.country_id === parseInt(selectedCountry)
    );
    setFilteredRegions(filteredRegions);
  }, [selectedCountry, regions]);
  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    setSelectedCountry(selectedCountryId);
    // Reset the selected region when the country changes
    setSelectedRegion('');
  };
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform the form submission logic here, such as sending the data to a server or performing further actions with the form values.
    console.log('Form submitted:', formValues);
    // Prepare the form data
  const formData = {
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    email: formValues.email,
    country: parseInt(selectedCountry),
    region: parseInt(selectedRegion),
    userAgreement: formValues.userAgreement,
  };
    // Send the form data to the server
    fetch('http://127.0.0.1:8000/api/save-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log('Form data saved:', data);
        // Reset the form after successful submission if needed
        setFormValues({
          firstName: '',
          lastName: '',
          email: '',
          userAgreement: false,
        });
        setSelectedCountry('');
        setSelectedRegion('');
      })
      .catch((error) => {
        console.error('Error saving form data:', error);
        // Handle any error occurred during form submission
      });
  };
  return (
    <div className="d-flex justify-content-center">
      <Form className="col-6" onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Enter first Name"
            type="text"
            value={formValues.firstName}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Enter last Name"
            type="text"
            value={formValues.lastName}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelectCountry">Select your Country</Label>
          <Input
            id="exampleSelectCountry"
            name="selectedCountry"
            type="select"
            onChange={handleCountryChange}
            value={selectedCountry}
          >
            <option value="">Select</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </Input>
        </FormGroup>
        {selectedCountry && (
          <FormGroup>
            <Label for="exampleSelectRegion">Select your Region</Label>
            <Input
              id="exampleSelectRegion"
              name="selectedRegion"
              type="select"
              value={selectedRegion}
              onChange={handleRegionChange}
            >
              <option value="">Select</option>
              {filteredRegions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        )}
        <FormGroup check>
          <Input
            id="userAgreement"
            name="userAgreement"
            type="checkbox"
            checked={formValues.userAgreement}
            onChange={handleInputChange}
          />
          <Label for="userAgreement" check>
            User agreement
          </Label>
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
export default FormComponent;