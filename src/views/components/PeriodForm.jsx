import React from "react";
import InputRequire from "./InputRequire";

const PeriodForm = ({error, data, handleBorneInfChange, handleBorneSupChange, handleInfiniteChange, infinite }) => {
    return (
        <div className="row">
            <div className={error.borne_inf.length ? "form-group col validated" : "form-group col"}>
                <label htmlFor="borne_inf">Borne inférieure <InputRequire/></label>
                <input
                    id="borne_inf"
                    type="number"
                    className={error.borne_inf.length ? "form-control is-invalid mt-1" : "form-control mt-1"}
                    placeholder="[2]"
                    min={0}
                    value={data.borne_inf}
                    onChange={(e) => handleBorneInfChange(e)}
                />
                {
                    error.borne_inf.length ? (
                        error.borne_inf.map((error, index) => (
                            <div key={index} className="invalid-feedback">
                                {error}
                            </div>
                        ))
                    ) : null
                }
            </div>

            <div className={error.borne_sup.length ? "form-group col validated" : "form-group col"}>
                <span className="d-flex justify-content-between">
                    <label htmlFor={"borne_sup"}>Borne supérieure <InputRequire/></label>
                    <label className="kt-checkbox">
                        <input id={"duplicate"} type="checkbox" checked={infinite} onChange={e => handleInfiniteChange(e)}/>
                        Infini
                        <span/>
                    </label>
                </span>
                <input
                    id="borne_sup"
                    type="number"
                    min={0}
                    className={error.borne_sup.length ? "form-control is-invalid" : "form-control"}
                    placeholder="[4]"
                    disabled={infinite}
                    value={data.borne_sup}
                    onChange={(e) => handleBorneSupChange(e)}
                />
                {
                    error.borne_sup.length ? (
                        error.borne_sup.map((error, index) => (
                            <div key={index} className="invalid-feedback">
                                {error}
                            </div>
                        ))
                    ) : null
                }
            </div>
        </div>
    );
};

export default PeriodForm;
