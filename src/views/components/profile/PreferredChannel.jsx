import React, {useState, useEffect} from "react";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {ToastBottomEnd} from "../Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../../config/toastConfig";
import {verifyTokenExpire} from "../../../middleware/verifyToken";
import {Link} from "react-router-dom";
import LoadingTable from "../LoadingTable";


const PreferredChannel = () => {
    const defaultData = {
        feedback_preferred_channels: []
    };

    const [data, setData] = useState(defaultData);
    const [listChannels, setListChannels] = useState("");
    const [startRequest, setStartRequest] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (verifyTokenExpire()) {
            axios.get(appConfig.apiDomaine + "/feedback-channels")
                .then(response => {
                    const newChannel={...data};
                    if (response.data.staff.feedback_preferred_channels!==null){
                        newChannel.feedback_preferred_channels=response.data.staff.feedback_preferred_channels;
                        setData(newChannel);
                    }
                    setListChannels(response.data);
                    setLoad(false)
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }
    }, []);

    const onChangeOption = (e, channel) => {
        const newData = {...data};
        if (e.target.checked === true) {
            newData.feedback_preferred_channels.push(channel)
        } else newData.feedback_preferred_channels = newData.feedback_preferred_channels.filter(item => item !== channel);
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (verifyTokenExpire()) {
            axios.put(appConfig.apiDomaine + "/feedback-channels", data)
                .then(response => {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(error => {
                    setStartRequest(false);
                    console.log("something is wrong");
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                })
            ;
        }
    };

    return (
        <div className="kt-portlet">
            <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">Canal de réponse</h3>
                </div>
            </div>
            <form className="kt-form kt-form--label-right">
                <div className="kt-portlet__body">
                    <div className="kt-section kt-section--first">
                        <div className="kt-section__body">
                            <div className="row">
                                <label className="col-xl-3"/>
                                <div className="col-lg-9 col-xl-6">
                                    <h3 className="kt-section__title kt-section__title-sm">Changer le canal de réponse:</h3>
                                </div>
                            </div>
                            {
                                !load && (
                                    listChannels.channels ?
                                        listChannels.channels.map((channel, index) => (
                                            <div className="form-group row" key={index}>
                                                <label className="col-xl-3 col-lg-3 col col-form-label ">{channel}</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <span className="kt-switch kt-switch--sm kt-switch--outline kt-switch--icon kt-switch--success ">
                                                    <label>
                                                        {data.feedback_preferred_channels.length ?
                                                            data.feedback_preferred_channels.map((feedback, i) => (
                                                                feedback === channel ?

                                                                    <input
                                                                        key={i}
                                                                        type="checkbox"
                                                                        onChange={(e) => onChangeOption(e, channel)}
                                                                        checked={"checked"}
                                                                        name={channel}
                                                                    />
                                                                    :
                                                                    <input
                                                                        key={i}
                                                                        type="checkbox"
                                                                        onChange={(e) => onChangeOption(e, channel)}
                                                                        name={channel}
                                                                    />
                                                            ))
                                                            :
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => onChangeOption(e, channel)}
                                                                name={channel}
                                                            />

                                                        }
                                                        <span/>
                                                    </label>
                                                    </span>
                                                </div>
                                            </div>
                                        )) : null
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="kt-portlet__foot">
                    <div className="kt-form__actions">
                        <div className="row">
                            <div className="col-lg-3 col-xl-3">
                            </div>
                            <div className="col-lg-9 col-xl-9">
                                {
                                    !startRequest ? (
                                        <button type="submit" onClick={(e) => onSubmit(e)}
                                                className="btn btn-primary">Enregistrer</button>
                                    ) : (
                                        <button
                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                            type="button" disabled>
                                            Chargement...
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PreferredChannel;