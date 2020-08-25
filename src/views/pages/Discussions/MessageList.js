import React, {useEffect, useState} from 'react';
import Message from './Message';
import moment from 'moment';
import './MessageList.css';
import {debug} from "../../../helpers/function";


export default function MessageList(props) {

    const [messages,setMessage] = useState([]);
    // const messages = props.getMessage.length ? props.getMessage : [];

    const MY_USER_ID = localStorage.getItem("staffData");

    useState(() => {
        setMessage(props.getMessage);
    }, [props.getMessage])

    useEffect(() => {
        if (MY_USER_ID) {
            window.Echo.private(`Satis2020.ServicePackage.Models.Identite.${MY_USER_ID}`)
                .notification((notification) => {
                    if (notification.type.substr(39, notification.type.length) === "PostDiscussionMessage") {
                        if (notification.discussion.id===props.idChat){
                            setMessage(m=>[...m, notification.message])
                        }

                    }
                });
        }
    }, [MY_USER_ID,props.idChat]);

const deletedMessage=(key)=>{
    props.deletedItem(key)
};
const responseMessage=(key, text)=>{
    props.responseItem(key, text)
};
    const renderMessages = () => {
        let i = 0;
        let messageCount = messages.length;
        let tempMessages = [];

        while (i < messageCount) {
            let previous = messages[i - 1];
            let current = messages[i];
            let next = messages[i + 1];
            let isMine = current.posted_by.identite_id === MY_USER_ID;
            let currentMoment = moment(current.created_at);
            let prevBySameAuthor = false;
            let nextBySameAuthor = false;
            let startsSequence = true;
            let endsSequence = true;
            let showTimestamp = true;

            if (previous) {
                let previousMoment = moment(previous.created_at);
                let previousDuration = moment.duration(currentMoment.diff(previousMoment));
                prevBySameAuthor = previous.posted_by.identite_id === current.posted_by.identite_id;

                if (prevBySameAuthor && previousDuration.as('hours') < 1) {
                    startsSequence = false;
                }

                if (previousDuration.as('hours') < 8) {
                    showTimestamp = false;
                }
            }

            if (next) {
                let nextMoment = moment(next.timestamp);
                let nextDuration = moment.duration(nextMoment.diff(currentMoment));
                nextBySameAuthor = next.posted_by.identite_id === current.posted_by.identite_id;

                if (nextBySameAuthor && nextDuration.as('hours') < 1) {
                    endsSequence = false;
                }
            }

            tempMessages.push(
                <Message
                    key={i}
                    isMine={isMine}
                    startsSequence={startsSequence}
                    endsSequence={endsSequence}
                    showTimestamp={showTimestamp}
                    data={current}
                    deleted={() =>deletedMessage(current.id)}
                    responseItem={() =>responseMessage(current.id, current.text)}
                />
            );
            i += 1;
        }
        return tempMessages;
    };

    return (
        <div className="message-list">
            <div className="message-list-container">{ messages.length ? renderMessages() : ""}</div>
        </div>
    );
}
