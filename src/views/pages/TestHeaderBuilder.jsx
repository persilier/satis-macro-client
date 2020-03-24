import React from "react";
import HeaderBuilder from "../components/HeaderBuilder";
import {editData} from "../../constants/headerBuilder";

const TestHeaderBuilder = () => {
    const addHeaderBuilder = (data) => {
        console.log(data, "Add header builder")
    };

    const updateHeaderBuilder = (data) => {
        console.log(data, "Update header builder");
    };
    return (
        <div className="container">
            <HeaderBuilder getData={data => addHeaderBuilder(data)}/>
        </div>
    );
};

export default TestHeaderBuilder;
