import React from "react";
import MessageContext from "./MessageContext";
import ContactContext from "./ContactContext";

export type ContactType = {
    id: number;
    username: string;
    name: string;
    new: boolean;
    lastMsg?: {
        msg: string;
        read: boolean;
        time: number;
    };
    lastActive?: {
        status: boolean;
        time: number
    }
}
export type MsgType = {
    id: string;
    msg: string;
    info: {
        from: string;
        to: string;
        read: boolean;
        timestamp: number;
        type: "private" | "group";
    },
    pull: {
        status: boolean,
        data?: MsgType
    },
    fwd?: string;
}
export type localMsgType = {
    username: string;
    data: MsgType[];
}

type ContextProps = {
    current: Partial<ContactType>;
    chatType: "group" | "private" | "idle";
    fn: {
        handleCurrent: (curr: ContactType, type: "private" | "group") => void;
        removeCurrent: () => void;
    },
    tgl: {
        tglHead: boolean,
        tglModal: boolean,
        fn: {
            setTglHead: React.Dispatch<React.SetStateAction<boolean>>,
            setTglModal: React.Dispatch<React.SetStateAction<boolean>>
        }
    }
}

const Context = React.createContext<ContextProps>({
    current: {},
    chatType: "idle",
    fn: {
        handleCurrent: () => { },
        removeCurrent: () => { }
    },
    tgl: {
        tglHead: false,
        tglModal: false,
        fn: {
            setTglHead: () => { },
            setTglModal: () => { }
        }
    }
})

export function useChat() {
    return React.useContext(Context);
}


function ChatContext({
    children
}: {
    children: React.ReactNode
}) {

    const [current, setCurrent] = React.useState<Partial<ContactType>>({});
    const [statusChat, setStatusChat] = React.useState<"idle" | "group" | "private">("idle");
    const [tglHead, setTglHead] = React.useState<boolean>(false);
    const [tglContact, setTglModal] = React.useState<boolean>(false);


    // handle current user chat
    const handleCurrent = React.useCallback((curr: ContactType, type: "private" | "group") => {
        setCurrent(curr);
        setStatusChat(type)
    }, [current, statusChat]);
    
    const removeCurrent = React.useCallback(() => {
        setCurrent({});
        setStatusChat("idle")
    }, [current, statusChat]);

    return (
        <Context.Provider value={{
            chatType: statusChat,
            current: current,
            fn: {
                handleCurrent: handleCurrent,
                removeCurrent: removeCurrent
            },
            tgl: {
                tglHead: tglHead,
                tglModal: tglContact,
                fn: {
                    setTglHead: setTglHead,
                    setTglModal: setTglModal
                }
            }
        }}>
            <ContactContext>
                <MessageContext>
                    {children}
                </MessageContext>
            </ContactContext>
        </Context.Provider>
    )
}

export default ChatContext