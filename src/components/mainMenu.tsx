import * as React from "react";
import { Link } from "react-router-dom";

export function MainMenu(){
    return <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/barcode-scanner">Barcode Scanner</Link></li>
    </ul>
}