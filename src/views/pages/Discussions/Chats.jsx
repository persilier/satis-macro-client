import React, {useEffect, useState} from 'react';
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {Link} from "react-router-dom";
import moment from "moment";
import Error401 from "../Error401";
import MessageList from "./MessageList";
import {ToastBottomEnd} from "../../components/Toast";
import {
    toastDeleteErrorMessageConfig,
    toastDeleteSuccessMessageConfig,
    toastErrorMessageWithParameterConfig,
} from "../../../config/toastConfig";
import {DeleteConfirmation} from "../../components/ConfirmationAlert";
import {confirmDeleteConfig} from "../../../config/confirmConfig";


const Chats = (props) => {
    const defaultData = {
        text: '',
        files: [],
        parent_id: "",
    };
    const defaultError = {
        text: '',
        files: [],
        parent_id: "",
    };
    const [data, setData] = useState(defaultData);
    const [listChat, setListChat] = useState("");
    const [listChatUsers, setListChatUsers] = useState([]);
    const [listChatMessages, setListChatMessage] = useState([]);
    const [idChat, setIdChat] = useState(null);
    const [startRequest, setStartRequest] = useState(false);
    const [messageTarget, setMessageTarget] = useState('');

    useEffect(() => {
        axios.get(appConfig.apiDomaine + "/discussions")
            .then(response => {
                setListChat(response.data)
            })
            .catch(error => {
                console.log("Something is wrong");
            });
    }, []);

    const onChangeText = (e) => {
        const newData = {...data};
        newData.text = e.target.value;
        setData(newData);
    };

    const onChangeFile = (e) => {
        const newData = {...data};
        newData.files = Object.values(e.target.files);
        setData(newData);
    };

    const responseToMessage = (id, text) => {
        const newData = {...data};
        newData.parent_id = id;
        setMessageTarget(text);
        setData(newData);
    };

    const closeTag = () => {
        const newData = {...data};
        newData.parent_id = "";
        newData.files = "";
        setMessageTarget("");
        setData(newData);
    };

    const onChangeDiscussion = (id) => {
        async function fetchData() {
            await axios.get(appConfig.apiDomaine + `/discussions/${id}/staff`)
                .then(response => {
                    setListChatUsers(response.data);
                    setIdChat(response.data[0].pivot.discussion_id)
                })
                .catch(error => {
                    console.log("Something is wrong");
                });
            await getListMessage(id)
        }

        fetchData()
    };

    const getListMessage = (id) => {
        async function fetchData() {
            await axios.get(appConfig.apiDomaine + `/discussions/${id}/messages`)
                .then(response => {
                    setListChatMessage(response.data);
                })
                .catch(error => {
                    console.log("Something is wrong");
                });
        }

        fetchData()
    };

    const formatFormData = (newData) => {
        const formData = new FormData();
        formData.append("_method", "post");
        for (const key in newData) {
            console.log(`${key}:`, newData[key]);
            if (key === "files") {
                for (let i = 0; i < (newData.files).length; i++)
                    formData.append("files[]", (newData[key])[i], ((newData[key])[i]).name);

            } else
                formData.set(key, newData[key]);
        }
        return formData;
    };

    const addItem = (e) => {
        e.preventDefault();
        let newData = {...data};
        if (!newData.files.length)
            delete newData.files;
        if (newData.parent_id === "")
            delete newData.parent_id;
        if ((data.text !== '' && idChat) || (data.files !== [] && idChat)) {
            setStartRequest(true);
            axios.post(appConfig.apiDomaine + `/discussions/${idChat}/messages`, formatFormData(newData))
                .then(response => {
                    console.log(response.data)
                    getListMessage(idChat);
                    const newItems = [...listChatMessages, response.data];
                    setListChatMessage(newItems);
                    setData(defaultError);
                    getListMessage(idChat);
                    setStartRequest(false);
                })
                .catch(error => {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error.text));
                    console.log("Something is wrong");
                });
        }
    };

    const deletedItem = (key, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    console.log(idChat, `listChatMessages${idChat}`)
                    axios.delete(appConfig.apiDomaine + `/discussions/${idChat}/messages/${key}`)
                        .then(response => {
                            getListMessage(idChat);
                            const filteredItems = listChatMessages.filter(item => item.key !== key);
                            setListChatMessage(filteredItems);
                            ToastBottomEnd.fire(toastDeleteSuccessMessageConfig);
                        })
                        .catch(error => {
                            ToastBottomEnd.fire(toastDeleteErrorMessageConfig);
                        })
                    ;
                }
            })
        ;
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Traitement
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="#button" onClick={e => e.preventDefault()}
                               className="kt-subheader__breadcrumbs-link">
                                Chats
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                <div className="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">

                    <div
                        className="kt-grid__item kt-app__toggle kt-app__aside kt-app__aside--lg kt-app__aside--fit"
                        id="kt_chat_aside">

                        {
                            listChat ?
                                <div className="kt-portlet kt-portlet--last">

                                    <div className="kt-portlet__body">
                                        <div className="kt-searchbar">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                            <span className="input-group-text"
                                                  id="basic-addon1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px"
                                                viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
																		<g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
																			<rect x="0" y="0" width="24"
                                                                                  height="24"></rect>
																			<path
                                                                                d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                                                                                fill="#000000" fillRule="nonzero"
                                                                                opacity="0.3"></path>
																			<path
                                                                                d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                                                                                fill="#000000"
                                                                                fillRule="nonzero"></path>
																		</g>
																	</svg>
                                            </span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="Search"
                                                       aria-describedby="basic-addon1"/>
                                            </div>
                                        </div>

                                        <div className="kt-widget kt-widget--users kt-mt-20">
                                            <div className="kt-scroll kt-scroll--pull ps ps--active-y"
                                                 data-mobile-height="300"
                                                 style={{height: '157px', overflow: 'hidden'}}>
                                                <div className="kt-widget__items">
                                                    {
                                                        listChat.map((chat, i) => (

                                                            <div className="kt-widget__item" key={i}>
                                                                <i className="fa-2x flaticon-chat-1"></i>
                                                                <div className="kt-widget__info">
                                                                    <div className="kt-widget__section">
                                                                        <a href={"#kt-chat"}
                                                                           onClick={(e) => onChangeDiscussion(chat.id)}
                                                                           className="kt-widget__username">{chat.name}
                                                                        </a>
                                                                        <span
                                                                            className="kt-badge kt-badge--success kt-badge--dot"></span>
                                                                    </div>

                                                                    <span className="kt-widget__desc">
																			{chat.claim.reference}
																		</span>
                                                                </div>
                                                                <div className="kt-widget__action">
                                                                <span
                                                                    className="kt-widget__date">{moment(chat.created_at).format('ll')}</span>
                                                                    <span
                                                                        className="kt-badge kt-badge--success kt-font-bold">{listChat.length}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : ""
                        }
                    </div>
                    <div className="kt-grid__item kt-grid__item--fluid kt-app__content" id="kt_chat_content">
                        <div className="kt-chat" id="kt-chat">
                            <div className="kt-portlet kt-portlet--head-lg- kt-portlet--last">
                                <div className="kt-portlet__head">
                                    <div className="kt-chat__head ">

                                        <div className="kt-chat__left"><span></span></div>
                                        <div className="kt-chat__center">
                                            <h5>Discussions</h5>
                                        </div>


                                        <div className="kt-chat__right">
                                            <div className="dropdown dropdown-inline">
                                                <button type="button"
                                                        className="btn btn-clean btn-sm btn-icon btn-icon-md"
                                                        data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">
                                                    <i className="flaticon2-add-1"></i>
                                                </button>
                                                <div
                                                    className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-md">

                                                    <ul className="kt-nav">
                                                        <li className="kt-nav__head">
                                                            Messaging
                                                            <Link
                                                                to={idChat ? `/treatment/chat/contributor/${idChat}` : ""}>
                                                                <i className="kt-nav__link-icon flaticon-eye"></i>
                                                            </Link>
                                                        </li>
                                                        <li className="kt-nav__separator"></li>
                                                        <li className="kt-nav__item">
                                                            <Link to={"/treatment/chat/add"}
                                                                  className="kt-nav__link">
                                                                <i className="kt-nav__link-icon flaticon-chat-1"></i>
                                                                <span
                                                                    className="kt-nav__link-text">New Chat</span>
                                                            </Link>
                                                        </li>

                                                        <li className="kt-nav__item">
                                                            <Link to={"treatment/chat/remove_chat"}
                                                                  className="kt-nav__link">
                                                                <i className="kt-nav__link-icon flaticon-delete"></i>
                                                                <span
                                                                    className="kt-nav__link-text">Remove Chat</span>
                                                            </Link>
                                                        </li>

                                                        <li className="kt-nav__separator"></li>

                                                        <li className="kt-nav__item">
                                                            <Link
                                                                to={idChat ? `/treatment/chat/add_user/${idChat}` : ""}
                                                                className="kt-nav__link">
                                                                <i className="kt-nav__link-icon flaticon2-group"></i>
                                                                <span
                                                                    className="kt-nav__link-text">Add Member</span>
                                                                <span className="kt-nav__link-badge">
                                                                <span
                                                                    className="kt-badge kt-badge--brand  kt-badge--rounded-">{listChatUsers.length}</span>
                                                            </span>
                                                            </Link>
                                                        </li>
                                                        <li className="kt-nav__item">
                                                            <Link
                                                                to={idChat ? `/treatment/chat/contributor/${idChat}` : ""}
                                                                className="kt-nav__link">
                                                                <i className="kt-nav__link-icon flaticon-delete"></i>
                                                                <span className="kt-nav__link-text">Remove Member</span>
                                                            </Link>
                                                        </li>
                                                    </ul>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="kt-portlet__body">
                                    <div className="kt-scroll kt-scroll--pull ps ps--active-y"
                                         data-mobile-height="300" style={{height: '250px', overflow: 'hidden'}}>
                                        <div className="message-list">

                                            {/*{console.log(listChatMessages, "Message")}*/}

                                            {
                                                listChatUsers ?
                                                    <MessageList
                                                        getList={listChatUsers}
                                                        getMessage={listChatMessages.reverse()}
                                                        deletedItem={deletedItem}
                                                        responseItem={responseToMessage}/>
                                                    : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="kt-portlet__foot">

                                    <div className="kt-chat__input">

                                        <input style={{display: "none"}}
                                               id="parent_id"
                                               type="text"
                                               value={data.parent_id}
                                               onChange={responseToMessage}
                                        />

                                        <div className="kt-chat__editor">
                                            {
                                                data.parent_id ?
                                                    <div className="message_target">
                                                        <i className="d-flex justify-content-end flaticon-close"
                                                           onClick={(e) => closeTag(e)}></i>
                                                        <i className="la la-tags"></i>
                                                        <br/>
                                                        <em>{messageTarget}</em>
                                                    </div> : ""
                                                // <div style={{display: "none"}}></div>
                                            }
                                            {
                                                data.files ?
                                                    data.files.map((file, i) => (
                                                        <div className="message_target" key={i}>
                                                            <i className="d-flex justify-content-end flaticon-close"
                                                               onClick={(e) => closeTag(e)}></i>
                                                            {
                                                                file.name
                                                            }
                                                        </div>
                                                    ))
                                                    : ""
                                            }
                                            <textarea
                                                style={{height: "35px"}}
                                                placeholder="Type here..."
                                                value={data.text}
                                                onChange={(e) => onChangeText(e)}
                                            />
                                        </div>
                                        <div className="kt-chat__toolbar">
                                            <div className="image-upload">
                                                <label htmlFor="file-input"
                                                       data-toggle="kt-tooltip"
                                                       title="Ajouter un fichier">
                                                    <i className="fas fa-paperclip"></i>
                                                </label>
                                                <input id="file-input"
                                                       type="file"
                                                       onChange={onChangeFile}
                                                       multiple={true}
                                                />

                                            </div>

                                            <div className="kt_chat__actions">
                                                {
                                                    !startRequest ? (
                                                        <button type="button"
                                                                onClick={(e) => addItem(e)}
                                                                className="btn btn-brand btn-md btn-upper btn-bold kt-chat__reply ">reply
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                            type="button" disabled>
                                                            Loading...
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chats;