import React, { useState } from "react";
import axios from "axios";
import { ToastBottomEnd, ToastLongBottomEnd } from "./Toast";
import {
  toastErrorMessageWithParameterConfig,
  toastSuccessMessageWithParameterConfig,
} from "../../config/toastConfig";
import InputRequire from "./InputRequire";
import { Link } from "react-router-dom";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";
import appConfig from "../../config/appConfig";

const ImportKnownClaim = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();
  const defaultData = {
    file: "",
  };
  const defaultError = {
    file: [],
    etat_update: [],
  };

  const [name, setName] = useState("");
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(defaultError);
  const [errorFile, setErrorFile] = useState([]);
  const [startRequest, setStartRequest] = useState(false);

  const handleChangeFile = (e) => {
    const newData = { ...data };
    setName(e.target.value);
    newData.file = Object.values(e.target.files)[0];
    setData(newData);
  };

  const onSubmit = async (e) => {
    const formData = new FormData();
    formData.append("file", data.file);
    if (props.claimImport) {
      //formData.append("etat_update", stateUpdate);
    }

    e.preventDefault();
    setStartRequest(true);

    const errorsField = props.errorsField ? props.errorsField : "errors";
    let endpoint = `${appConfig.apiDomaine}/my/claims-file-extraction`;

    if (verifyTokenExpire()) {
      await axios
        .post(endpoint, formData)
        .then((response) => {
          setStartRequest(false);
          setError(defaultError);
          if (response.data.claim) {
            setName("");
            setData(defaultData);
            ToastBottomEnd.fire(
              toastSuccessMessageWithParameterConfig(
                t("Succès de l'importation")
              )
            );
          } else {
            setErrorFile(response.data[errorsField]);
            ToastLongBottomEnd.fire(
              toastErrorMessageWithParameterConfig(
                response.data[errorsField].length +
                  " " +
                  t(
                    "erreurs identifiées. Veuillez supprimer les lignes correctes puis corriger les lignes erronées avant de renvoyer le fichier"
                  )
              )
            );
          }
        })
        .catch(({ response }) => {
          setStartRequest(false);
          if (response.data[errorsField] && response.data[errorsField].length) {
            setErrorFile(response.data[errorsField]);
            ToastLongBottomEnd.fire(
              toastErrorMessageWithParameterConfig(
                response.data[errorsField].length +
                  " " +
                  t(
                    "erreurs identifiées. Veuillez corriger les lignes erronées avant de renvoyer le fichier"
                  )
              )
            );
          } else if (response.data.code === 422) {
            setError({ ...defaultError, ...response.data.error });
            ToastBottomEnd.fire(
              toastErrorMessageWithParameterConfig(t("Echec de l'importation"))
            );
          } else if (response.data.code === 413) {
            ToastBottomEnd.fire(
              toastErrorMessageWithParameterConfig(
                t(
                  "Echec de l'importation. Fichier trop volumineux pour le traitement."
                )
              )
            );
          } else {
            ToastBottomEnd.fire(
              toastErrorMessageWithParameterConfig(t("Echec de l'importation"))
            );
          }
        });
    }
  };

  return ready ? (
    <div className="kt-container kt-container--fluid  kt-grid__item kt-grid__item--fluid">
      <div className="row">
        <div className="col">
          <div className="kt-portlet">
            <div className="kt-portlet__head">
              <div className="kt-portlet__head-label">
                <h3 className="kt-portlet__head-title">
                  {props.panelExcelTitle}
                </h3>
              </div>
            </div>

            <form method="POST" className="kt-form">
              <div className="kt-form kt-form--label-right">
                <div className="kt-portlet__body">
                  <div
                    className={
                      error.file.length
                        ? "form-group row validated"
                        : "form-group row"
                    }
                  >
                    <label
                      className="col-xl-3 col-lg-3 col-form-label"
                      htmlFor="senderID"
                    >
                      {t("Fichier")} <InputRequire />
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <input
                        id="senderID"
                        type="file"
                        className={
                          error.file.length || errorFile.length
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder={t("Veuillez choisir le fichier")}
                        value={name}
                        onChange={(e) => handleChangeFile(e)}
                      />
                      {error.file.length
                        ? error.file.map((error, index) => (
                            <div key={index} className="invalid-feedback">
                              {error}
                            </div>
                          ))
                        : null}

                      {/*{index + 1}-  {error}*/
                      errorFile.length
                        ? errorFile.map((element, index) =>
                            element.messages ? (
                              <div key={index} className="invalid-feedback">
                                {Object.keys(element.messages).map(
                                  (message, idx) =>
                                    message.length
                                      ? element.messages[message].map(
                                          (error, id) => {
                                            return (
                                              <>
                                                {" " +
                                                  (idx === 0
                                                    ? t("ligne ") +
                                                      element.line +
                                                      " - "
                                                    : "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0") +
                                                  error}
                                                <br />
                                              </>
                                            );
                                          }
                                        )
                                      : null
                                )}
                              </div>
                            ) : null
                          )
                        : null}
                    </div>
                  </div>
                </div>
                <div className="kt-portlet__foot">
                  <div className="kt-form__actions text-right">
                    {!startRequest ? (
                      <button
                        type="submit"
                        onClick={(e) => onSubmit(e)}
                        className="btn btn-primary"
                      >
                        {t("Enregistrer")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                        type="button"
                        disabled
                      >
                        {t("Chargement")}...
                      </button>
                    )}

                    {!startRequest ? (
                      <Link
                        to={props.pageTitleLink}
                        className="btn btn-secondary mx-2"
                      >
                        {t("Quitter")}
                      </Link>
                    ) : (
                      <Link
                        to={props.pageTitleLink}
                        className="btn btn-secondary mx-2"
                        disabled
                      >
                        {t("Quitter")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ImportKnownClaim;
