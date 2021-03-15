import React from 'react';

const InfoFormatExcel = () => {

    return (
        <div className="dropdown dropdown-inline show">
            <button type="button"
                    className="btn btn-clean btn-sm btn-icon btn-icon-md"
                    data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="true"><i className="fa fa-info-circle"/>
            </button>
            <div
                className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-md show"
                x-placement="bottom-end"
                style={{
                    position: "absolute",
                    transform: "translate3d(-227px, 33px, 0px)",
                    top: "0px",
                    left: '0px',
                    willChange: 'transform'
                }}>
                <p className="mt-2 ml-3">
                    <span
                        className="kt-nav__link-text">1- Cliquer d'abord sur <strong>Télécharger Format</strong> pour récupérer le format du fichier excel</span>
                    <br/>
                    <span
                        className="kt-nav__link-text">2- Cliquer ensuite sur <strong>Importer réclamation</strong> pour importer les reclamations saisies dans le fichier excel téléchargé </span>
                </p>
            </div>
        </div>
    );

};

export default InfoFormatExcel;