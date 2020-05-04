import React, {useState} from "react";
// import axios from "axios";
// import {
//     Link
// } from "react-router-dom";
// import {ToastBottomEnd} from "./Toast";
// import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig} from "../../config/toastConfig";
// import appConfig from "../../config/appConfig";


const AddFormInstitutions = () => {
    // const [logo,setLogo]=useState(undefined);
    const onChangeLogo = (e) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var image=document.getElementById('Image1');
            console.log(image,'image');
            image.src= "/"+e.target.result;
        };
        reader.readAsText(file);
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="kt-wizard-v4" id="kt_user_add_user" data-ktwizard-state="step-first">
                    <div className="kt-portlet">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div className="kt-grid">
                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v4__wrapper">
                                    <form className="kt-form" id="kt_user_add_form">
                                        <div className="kt-wizard-v4__content" data-ktwizard-type="step-content"
                                             data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">User's Profile Details:</div>
                                            <div className="kt-section kt-section--first">
                                                <div className="kt-wizard-v4__form">
                                                    <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="kt-section__body">
                                                                <div className="form-group row">
                                                                    <label
                                                                        className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
                                                                    <div className="col-lg-9 col-xl-6">
                                                                        <div className="kt-avatar kt-avatar--outline"
                                                                             id="kt_user_add_avatar">
                                                                            <div className="kt-avatar__holder">
                                                                                <img id="Image1" src="/assets/media/users/300_10.jpg" alt="logo"/>
                                                                            </div>
                                                                            <label className="kt-avatar__upload"
                                                                                   id="files"
                                                                                   data-toggle="kt-tooltip"
                                                                                   title="Change avatar">
                                                                                <i className="fa fa-pen"></i>
                                                                                <input type="file"
                                                                                       id="file"
                                                                                       name="kt_user_add_user_avatar"
                                                                                       onChange={(e)=>onChangeLogo(e)}/>
                                                                            </label>
                                                                            <span className="kt-avatar__cancel"
                                                                                  data-toggle="kt-tooltip"
                                                                                  title="Cancel avatar">
																									<i className="fa fa-times"></i>
																								</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
)
};

export default AddFormInstitutions;
