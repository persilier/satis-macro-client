import React, {useRef, useEffect, useState} from "react";
import ModalContainer from "../Modal/ModalContainer";
import ModalCloseButton from "../Modal/ModalCloseButton";
import ModalFooter from "../Modal/ModalFooter";
import ModalCloseIcon from "../Modal/ModalCloseIcon";
import ModalHead from "../Modal/ModalHead";
import ModalTitle from "../Modal/ModalTitle";
import ModalBody from "../Modal/ModalBody";

const MemberDescriptionModal = ({message, title = "Message"}) => {
    const element = useRef(null);
    const [memberList, setMemberList] = useState(message);
    useEffect(() => {
        setMemberList(message);
    }, [message]);

    return (
        <ModalContainer modalId="member">
            <ModalHead>
                <ModalTitle>{title}</ModalTitle>
                <ModalCloseIcon/>
            </ModalHead>

            <ModalBody>
                { memberList && memberList.length > 0  ? memberList.map((item, index) => (
                    <p key={index}>{`${(item.identite && item.identite.lastname) ? item.identite.lastname : ''} ${(item.identite && item.identite.firstname) ? item.identite.firstname : ''}`} </p>

                    )) : <h6>Aucune liste trouvée ! </h6>}
            </ModalBody>

            <ModalFooter>
                <ModalCloseButton>Close</ModalCloseButton>
            </ModalFooter>
        </ModalContainer>
    );
};

export default MemberDescriptionModal;