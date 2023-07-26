import React, { Component } from "react";
import Modal from "react-modal";
import { Preview, Instructions } from "./";
import {
  AboutForm,
  ContactForm,
  ExperienceForm,
  HeaderFooterForm,
  IntroForm,
  ProjectForm,
  SocialmediaLinksEmailForm,
} from "./forms";
import "./PortfolioBuilder.css";
import AppData from "./emptyData";
import UploadFiles from "./components/upload-files.component";
import UserForm from "./UserForm";

const previewModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
  },
  content: {
    top: "50px",
    overflow: "auto",
    padding: 0,
    zIndex: 100,
  },
};

const userNameModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
  },
  content: {
    top: "30%",
    maxHeight: "50vh",
    left: "100px",
    right: "100px",
    overflow: "auto",
    padding: 0,
    zIndex: 100,
  },
};

Modal.setAppElement("#root");

class PortfolioBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: 0,
      openPreview: false,
      getUser: false,
      appData: { ...AppData, image1: "", image2: "" },
      isCurrFormSaved: false,
      image1Name: "",
      image2Name: "",
      showUploadImage: false,
    };
  }

  forms = [
    <Instructions />,
    <IntroForm />,
    <AboutForm />,
    <ExperienceForm />,
    <ProjectForm />,
    <ContactForm />,
    <HeaderFooterForm />,
    <SocialmediaLinksEmailForm />,
  ];

  updateUserData = (newData, propName) => {
    this.setState((prevState) => {
      const updatedObj = {
        ...prevState,
        appData: {
          ...prevState.appData,
          userData: {
            ...prevState.appData.userData,
            [propName]: newData,
          },
        },
        isCurrFormSaved: true,
      };
      return updatedObj;
    });
  };

  updateHeaderFooterData = (newData) => {
    this.setState((prevState) => {
      const updatedObj = {
        ...prevState,
        appData: {
          ...prevState.appData,
          headerData: newData.headerData,
          footerData: newData.footerData,
        },
        isCurrFormSaved: true,
      };
      return updatedObj;
    });
  };

  updateLinksEmailsData = (newData) => {
    this.setState((prevState) => {
      const updatedObj = {
        ...prevState,
        appData: {
          ...prevState.appData,
          socialMediaLinks: newData.socialMediaLinks,
          emails: newData.emails,
        },
        isCurrFormSaved: true,
      };
      return updatedObj;
    });
  };

  updateParentData = (data) => {
    this.setState({ appData: data });
    this.setState({ showUploadImage: true });
  };

  // HOC this gets a component and return a same component with added props,
  // Need it, as i have array of components and adding props later on
  SelectedFormComponentWithProps = (Component, props) => {
    if (!Component) return null;
    const WrappedComponent = () => <Component {...props} />;
    return <WrappedComponent />;
  };

  renderSectionContent() {
    const { activeSection } = this.state;
    if (activeSection >= this.forms.length || activeSection < 0) return null;

    const selectedForm = this.forms[activeSection];
    return this.SelectedFormComponentWithProps(
      selectedForm.type,
      activeSection && activeSection <= 5
        ? {
            updateUserData: this.updateUserData,
            userData: this.state.appData.userData,
          }
        : activeSection === 6
        ? {
            updateHeaderFooterData: this.updateHeaderFooterData,
            headerData: this.state.appData.headerData,
            footerData: this.state.appData.footerData,
          }
        : activeSection === 7
        ? {
            updateLinksEmailsData: this.updateLinksEmailsData,
            socialMediaLinks: this.state.appData.socialMediaLinks,
            emails: this.state.appData.emails,
          }
        : {}
    );
  }

  handleButtonClick(idx) {
    this.setState({ ...this.state, activeSection: idx });
  }

  togglePreview() {
    this.setState({ ...this.state, openPreview: !this.state.openPreview });
  }

  getUser() {
    this.setState({ ...this.state, getUser: !this.state.getUser });
  }

  handleImageUpload = (event, imageKey) => {
    // if the image field is already set, return
    if (this.state.appData[imageKey]) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState((prevState) => ({
        appData: {
          ...prevState.appData,
          [imageKey]: reader.result,
        },
      }));
    };

    this.setState({
      ...this.state,
      [imageKey + "Name"]: event.target.files[0].name,
    });

    reader.readAsDataURL(file);
  };

  render() {
    return (
      <div className="portfolioBuilder">
        <div className="switch-btn">
          <button
            onClick={() => this.handleButtonClick(this.state.activeSection - 1)}
            disabled={this.state.activeSection === 0}>
            Previous
          </button>
          <button
            onClick={() => this.togglePreview()}
            // disabled={
            //   this.state.activeSection === 0 || !this.state.isCurrFormSaved
            // }
          >
            Preview
          </button>
          <button
            className="generate-json"
            onClick={() => this.getUser()}
            // disabled={
            //   this.state.activeSection === 0 || !this.state.isCurrFormSaved
            // }
          >
            Deploy Portfolio
          </button>
          {/* {this.state.activeSection + 1 === this.forms.length && ( */}
          <button
            // disabled={!this.state.isCurrFormSaved}
            onClick={() => {
              const json = JSON.stringify(this.state.appData);
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.download = "data.json";
              a.href = url;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}>
            Generate JSON
          </button>
          {/* )} */}
          <button
            onClick={() => {
              this.state.isCurrFormSaved = false;
              this.handleButtonClick(this.state.activeSection + 1);
            }}
            disabled={
              this.state.activeSection !== 0 &&
              (this.state.activeSection + 1 >= this.forms.length ||
                !this.state.isCurrFormSaved)
            }>
            Next
          </button>
        </div>
        <div
          style={
            this.state.activeSection === 0 || this.state.isCurrFormSaved
              ? { display: "none" }
              : {
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px 0",
                  backgroundColor: "antiquewhite",
                  color: "#ff0e0e",
                  padding: "5px 2px",
                }
          }>
          <p style={{ margin: 0 }}>
            Please save the current form before previewing or proceeding to the
            next form.
          </p>
        </div>
        <div
          className="container"
          style={
            this.state.activeSection !== 0
              ? { display: "none" }
              : { width: "auto", margin: "10px" }
          }>
          <div style={{ margin: "20px 0" }}>
            <h4>Upload your already built Resume for parsing</h4>
          </div>

          <UploadFiles updateParentData={this.updateParentData} />
          {this.state.showUploadImage && (
            <div>
              <label htmlFor="image1-upload" className="custom-file-upload">
                Upload Image1
              </label>
              <input
                id="image1-upload"
                type="file"
                accept="image/*"
                onChange={(event) => this.handleImageUpload(event, "image1")}
                style={{ display: "none" }}
              />
              <div className="image-name">{this.state.image1Name}</div>

              <label htmlFor="image2-upload" className="custom-file-upload">
                Upload Image2
              </label>
              <input
                id="image2-upload"
                type="file"
                accept="image/*"
                onChange={(event) => this.handleImageUpload(event, "image2")}
                style={{ display: "none" }}
              />
              <div className="image-name">{this.state.image2Name}</div>
            </div>
          )}
        </div>

        <div className="form-section">{this.renderSectionContent()}</div>

        <Modal
          isOpen={this.state.openPreview}
          onRequestClose={() => this.togglePreview()}
          style={previewModalStyles}>
          <div style={{ pointerEvents: "none" }}>
            <Preview {...this.state.appData} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.getUser}
          onRequestClose={() => this.getUser()}
          style={userNameModalStyles}>
          <div>
            <UserForm dataJson={this.state.appData} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default PortfolioBuilder;

// upload image and change it to base 64 , populate fields in appData ,
// post call , images saved in data
// 1) image uplaoded first , then display pics got empty - images should not be overrided

// images where stored , shouls not be src , it should be rendered on UI
