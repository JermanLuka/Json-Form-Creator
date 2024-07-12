import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Body(){
    return(
        <div>
            <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is the body of your application.</p>
            <Link to="/form" className="btn btn-primary">Go to Form</Link>
            </div>
        </div>
    )
}

export default Body;