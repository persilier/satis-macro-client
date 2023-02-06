import React from "react";
import { connect } from "react-redux";

const Footer = ({year}) => {
   
  return (
    <div className="kt-footer kt-grid__item" id="kt_footer">
      <div className="kt-container  kt-container--fluid ">
        <div className="kt-footer__wrapper">
          <div className="kt-footer__copyright">
            &nbsp;&copy;&nbsp;
            <a
              href="http://www.dmdconsult.com/"
              target="_blank"
              className="kt-link"
            >
              {` Satis FinTech SA ${year} - ${new Date().getFullYear()}`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    plan: state.plan.plan,
    year: state.year.year,
  };
};

export default connect(mapStateToProps)(Footer);
