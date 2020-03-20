import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
} from "react-router-dom";
import LayoutChoice from "./LayoutChoice";
import LayoutOne from "./LayoutOne";
import LayoutTwo from "./LayoutTwo";
import LayoutThree from "./LayoutThree";
import LayoutFour from "./LayoutFour";

const FormBuilder = (props) => {
    const [layoutChoice, setLayoutChoice] = useState(undefined);
    const [defaultLayoutSelected, setDefaultLayoutSelect] = useState(false);
    useEffect(() => {
        if (props.layout) {
            if (props.layout === 'layout-1' || props.layout === 'layout-2' || props.layout === 'layout-3' || props.layout === 'layout-4') {
                setDefaultLayoutSelect(true);
                setLayoutChoice(props.layout);
            }
        }
    }, []);
    const onChooseLayout = (layout) => {
        setLayoutChoice(layout);
    };

    const returnLayoutChoice = () => {
        setLayoutChoice(undefined);
    };

    const printLayout = () => {
        switch (layoutChoice) {
            case "layout-1":
                return <LayoutOne defaultLayoutSelected={defaultLayoutSelected} getFormData={(data) => props.getFormData(data)} returnLayoutChoice={() => returnLayoutChoice()}/>;
            case "layout-2":
                return <LayoutTwo defaultLayoutSelected={defaultLayoutSelected} getFormData={(data) => props.getFormData(data)} returnLayoutChoice={() => returnLayoutChoice()}/>;
            case "layout-4":
                return <LayoutFour defaultLayoutSelected={defaultLayoutSelected} getFormData={(data) => props.getFormData(data)} returnLayoutChoice={() => returnLayoutChoice()}/>;
            default :
                return <LayoutThree defaultLayoutSelected={defaultLayoutSelected} getFormData={(data) => props.getFormData(data)} returnLayoutChoice={() => returnLayoutChoice()}/>;
        }
    };

    return (
        <Router>
            <div className={"container"}>
                <h3 className="text-center" style={{marginBottom: '4rem'}}>Form Builder</h3>
                {
                    !layoutChoice ? (
                        <LayoutChoice onChooseLayout={onChooseLayout}/>
                    ) : (
                        printLayout()
                    )
                }
            </div>
        </Router>
    );
};

export default FormBuilder;
