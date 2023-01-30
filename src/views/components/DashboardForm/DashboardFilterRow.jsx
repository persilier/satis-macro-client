import React, { useState } from "react";
import Select, { components } from "react-select";
import { verifyPermission } from "../../../helpers/permission";
import { connect } from "react-redux";
import "../../pages/css/DashboardStyle.css";
import NativeDatepicker from "../../../appLibraries/NativeDatePicker/NativeDatePicker";
import { useRef } from "react";

const DashboardFilterRow = (props) => {
  const {
    handleDateStartChange,
    filterdate,
    handleFilterDateChange,
    handleDateEndChange,
    dateEnd,
    dateStart,
    setspacialdate,
    spacialdate,
    resetFilter,
  } = props;
  const [closeMenu, setcloseMenu] = useState(false);

  let innerRef = useRef();
  const canshow =
    verifyPermission(
      props.userPermissions,
      "show-dashboard-data-all-institution"
    ) ||
    verifyPermission(
      props.userPermissions,
      "show-dashboard-data-my-institution"
    );
  document.addEventListener(
    "click",
    function(e) {
      e = e || window.event;
      var target = e.target;
      let excludesi = [
        "menu-select-container",
        "NativeDatepicker__input",
        "filter-date-button-container",
        "remove-filter",
        "filter-date-button",
        "filter-date-remove",
      ];
      let goOut = false;
      for (let i = 0; i < excludesi.length; i++) {
        if (`${target.className}`.trim().includes(excludesi[i])) {
          goOut = true;
          break;
        }
      }
      if (!goOut) {
        setcloseMenu(false);
      }
    },
    false
  );
  const FilterCeule = (filter) => {
    let { value, onChange } = filter;

    return (
      <>
        <Select
          menuIsOpen={closeMenu}
          onFocus={() => {
            setcloseMenu(true);
            innerRef?.selectItem?.focus();
          }}
          ref={(node) => (innerRef = node)}
          className=""
          options={[
            {
              value: "010cc0c0-8f4f-4847-90bf-136e3e112f7e",
              label: "COMPTE ENTREPRISE",
              key: "dateRange",
            },
            {
              value: "30days",
              label: "30 derniers jours",
              key: "30",
            },
            {
              value: "45days",
              label: "45 derniers jours",
              key: "45",
            },
            {
              value: "3months",
              label: "3 derniers mois",
              key: "90",
            },
            {
              value: "remove",
              label: "Supprimer les filtres",
              key: "remove-filter",
            },
          ]}
          value={value}
          placeholder={"Filtrer par période"}
          closeMenuOnSelect={false}
          isSearchable={false}
          onChange={onChange}
          styles={{
            placeholder: (base) => ({
              ...base,
              paddingTop: 2,
            }),
            valueContainer: (base) => ({
              ...base,
              color: "white",
              width: "100%",
              paddingTop: 20,
              padding: "-5px 8px",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 30,
            }),
            control: (base) => ({
              ...base,
              borderWidth: 0,
              paddingLeft: 10,
              position: "relative",
            }),
          }}
          components={{
            Control: ({ children, ...props }) => (
              <components.Control {...props}>
                <i className="filter-calendar-icon flaticon2-calendar-2 fs-1" />
                {children}
                {closeMenu ? (
                  <i className="filter-calendar-icon-s flaticon2-up " />
                ) : (
                  <i className="filter-calendar-icon-s flaticon2-down " />
                )}
              </components.Control>
            ),
            Placeholder: (props) => {
              return <components.Placeholder className="" {...props} />;
            },
            IndicatorSeparator: ({ innerProps }) => {
              return <span />;
            },
            DropdownIndicator: (props) => {
              return (
                <components.DropdownIndicator {...props}>
                  <span></span>
                </components.DropdownIndicator>
              );
            },
            Option: (optiondata) => {
              let { innerProps, isDisabled, data } = optiondata;
              if (data.key === "dateRange") {
                return (
                  <div className="row mb-5">
                    <div className="date-selector col col-6">
                      <div className=" d-flex flex-column">
                        <span>De</span>
                        <NativeDatepicker
                          value={dateStart}
                          onChange={(newValue) => {
                            setcloseMenu(true);
                            handleDateStartChange(newValue);
                          }}
                          className=" w-100"
                        >
                          <div className="date-pickeri">
                            <i className="filter-calendar-icon flaticon2-calendar-2 fs-1" />
                            <span>{dateStart}</span>
                          </div>
                        </NativeDatepicker>
                      </div>
                    </div>
                    <div className="date-selector col col-6">
                      <div className=" d-flex flex-column">
                        <span>A</span>
                        <NativeDatepicker
                          value={dateEnd}
                          onChange={(newValue) => {
                            setcloseMenu(true);
                            handleDateEndChange(newValue);
                          }}
                          className=" w-100"
                        >
                          <div className="date-pickeri">
                            <i className="filter-calendar-icon flaticon2-calendar-2 fs-1" />
                            <span>{dateEnd}</span>
                          </div>
                        </NativeDatepicker>
                      </div>
                    </div>
                  </div>
                );
              }
              if (data.key === "remove-filter") {
                return (
                  <div className="d-flex p-3 remove-filter">
                    <button
                      type="date"
                      onClick={(e) => {
                        handleDateEndChange("");
                        handleDateStartChange("");
                        handleFilterDateChange("");
                        handleFilterDateChange("");
                        setspacialdate("");
                        resetFilter("");
                      }}
                      className="filter-date-remove"
                      value={data.value}
                    >
                      {data.label}
                    </button>
                  </div>
                );
              }
              if (!Number.isNaN(data.key)) {
                return (
                  <div className="d-flex filter-date-button-container">
                    <button
                      type="date"
                      onClick={(e) => {
                        setspacialdate(data.value);
                      }}
                      className={`filter-date-button ${
                        spacialdate === data.value
                          ? "filter-date-button-active "
                          : ""
                      }`}
                      value={data.value}
                    >
                      {data.label}
                    </button>
                  </div>
                );
              }

              return !isDisabled ? (
                <div {...innerProps}>
                  <input type="text" />
                </div>
              ) : null;
            },
            MenuList: (props) => {
              return (
                <div className="menu-select-container">{props.children}</div>
              );
            },
          }}
        />
      </>
    );
  };

  const FilterCeuleOneDate = (filter) => {
    return (
      <>
        <div className="d-flex w-100 align-items-center">
          <NativeDatepicker
            value={filterdate}
            onChange={(newValue) => {
              handleFilterDateChange(newValue);
            }}
            className=" w-100"
          >
            <div className="date-pickera">
              <i className="filter-calendar-icon flaticon2-calendar-4 fs-1" />
              <span className="">Filtrer par date</span>
              <span className="ml-5">
                <i className="filter-calendar-arrow-icon flaticon2-down" />
              </span>
            </div>
          </NativeDatepicker>
        </div>
      </>
    );
  };

  return canshow ? (
    <div className="kt-portlet py-3 px-5">
      <div className="w-100 row">
        <div className="">
          <FilterCeuleOneDate />
        </div>
        <div
          className="ml-0 ml-lg-5 p-0"
          style={{ width: 200, marginTop: "-1px" }}
        >
          <FilterCeule />
        </div>
      </div>
    </div>
  ) : null;
};
const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(DashboardFilterRow);
