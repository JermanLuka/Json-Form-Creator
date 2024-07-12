// src/components/FormComponent.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import data from './data.json';
import msgpack from 'msgpack-lite';
    
const FormComponent: React.FC = () => {
    const [formData] = useState<any[]>(data); // Using useState with imported data

    // function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //     event.preventDefault(); // Prevent default form submission behavior
    
    //     const formDataObject: any = {}; // Initialize an empty object to store form data
    //     const formData = new FormData(event.target as HTMLFormElement); // Create FormData object from form element
    
    //     // Populate formDataObject with form field values using for...of loop
    //     for (let [key, value] of formData.entries()) {
    //         formDataObject[key] = value;
    //     }
    
    //     console.log('Form Data:', formDataObject); // Log form data object
    
    //     // Validate form data
    //     if (validateFormData(formDataObject)) {
    //         // If validation passes, convert formDataObject to MessagePack byte stream and save it
    //         saveDataAsByteStream(formDataObject);
    //     } else {
    //         // Handle validation errors (optional)
    //         console.error('Form validation failed.');
    //     }
    // }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const formDataObject: any = {}; // Initialize an empty object to store form data
        const formData = new FormData(event.target as HTMLFormElement); // Create a new FormData object from the form element
    
        // Iterate over each form field and populate the formDataObject
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
    
        console.log('Form Data:', formDataObject); // Log the form data object to the console
    
        // Call a function to convert formDataObject to a MessagePack byte stream and save it
        saveDataAsByteStream(formDataObject);
    }

      function validateFormData(formData: any): boolean {
        // Iterate through formData keys and validate based on rules in data.json
        for (const field of formData) {
          const fieldConfig = formData.find((config: any) => config.key === field.key);
          if (fieldConfig) {
            if (fieldConfig.validation.required && !formData[field.key]) {
              return false; // Field is required but empty
            }
            if (fieldConfig.validation.maxLength && formData[field.key]?.length > fieldConfig.validation.maxLength) {
              return false; // Field exceeds maximum length
            }
            if (fieldConfig.key === 'age') {
              const age = parseInt(formData[field.key]);
              if (isNaN(age) || (fieldConfig.validation.min && age < fieldConfig.validation.min) || (fieldConfig.validation.max && age > fieldConfig.validation.max)) {
                return false; // Age is not a valid number or outside specified range
              }
            }
            if (fieldConfig.key === 'email') {
              const pattern = new RegExp(fieldConfig.validation.pattern);
              if (!pattern.test(formData[field.key])) {
                return false; // Email format is invalid
              }
            }
            if (fieldConfig.validation.pattern) {
              const pattern = new RegExp(fieldConfig.validation.pattern);
              if (!pattern.test(formData[field.key])) {
                return false; // Field does not match custom pattern
              }
            }
          }
        }
        return true; // All validations passed
      }
    
      async function saveDataAsByteStream(formData: any) {
        console.log('Saving data as byte stream:', formData);
    
        // Convert JavaScript object to MessagePack byte stream
        const encodedData = msgpack.encode(formData);
    
        // Create a Blob from encoded data
        const blob = new Blob([encodedData], { type: 'application/octet-stream' });
    
        // Create a download link and trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formData.bin'; // .bin extension for binary file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Dynamic Form</h2>
          <form onSubmit={handleSubmit}>
            {formData.map(field => (
              <div key={field.key} className="mb-3">
                <label htmlFor={field.key} className="form-label">{field.label}</label>
                <input 
                  type={field.type} 
                  id={field.key} 
                  name={field.key} 
                  className="form-control" 
                  placeholder={`Enter ${field.label}`} // Placeholder text
                  required  // Required attribute
                />
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormComponent;