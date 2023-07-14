import React, { useState, useRef, useEffect, Dispatch, SetStateAction, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck, faBan, faPaperPlane, faPencil } from "@fortawesome/free-solid-svg-icons";
import "./ChatBox.scss";
import { IMessageData } from "../Main/Main";

interface ChatBoxProps {
    messages: IMessageData[];
    setMessages: Dispatch<SetStateAction<IMessageData[]>>;
    user: string;
    users: string[];
}

const ChatBox = ({messages, setMessages, user, users}: ChatBoxProps) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() !== "") {
            if (editingMessageId) {
                setMessages((prevMessages: IMessageData[]) =>
                    prevMessages.map((message: IMessageData) =>
                        message.id === editingMessageId ? { ...message, text: inputValue, updated: true } : message
                    )
                );
                setEditingMessageId(null);
            } else {
                const newMessage = {
                    user,
                    id: messages.length + 1,
                    text: inputValue,
                    timestamp: new Date().getTime(),
                    updated: false,
                };
                setMessages([...messages, newMessage]);
            }
            setInputValue("");
        }
    };

    const handleEditMessage = (messageId: number) => {
        const messageToEdit: IMessageData | undefined = messages.find((message: IMessageData) => message.id === messageId);
        if (messageToEdit) {
            setInputValue(messageToEdit.text);
            setEditingMessageId(messageId);
        }
    };

    const handleCancelEdit = () => {
        setInputValue("");
        setEditingMessageId(null);
    };

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-box">
            <div className="chat-header">
                { users.filter((u) => u !== user).join(", ") }
            </div>
            <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((message) => (
                <div key={message.id} className={`message ${message.user === user ? "sent" : ""}`}>
                    <div className="message-username">{message.user}</div>
                    <div className="message-text">{message.text}</div>
                    <div className="message-data">{message.updated ? <FontAwesomeIcon icon={faPencil}/> : ""} {new Date(message.timestamp).toLocaleTimeString().slice(0, 5)} {!editingMessageId && message.user === user && <button onClick={() => handleEditMessage(message.id)}><FontAwesomeIcon icon={faEdit} /></button>}</div>
                    {message.id === editingMessageId && (
                    <div className="message-actions">
                        <button onClick={handleCancelEdit}><FontAwesomeIcon icon={faBan} /></button>
                        <button onClick={() => handleSendMessage()} disabled={!inputValue.trim()}><FontAwesomeIcon icon={faCheck} /></button>
                    </div>
                    )}
                </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type your message..." />
                <button onClick={handleSendMessage} disabled={!inputValue.trim() && !editingMessageId}>
                    {editingMessageId ? <FontAwesomeIcon icon={faEdit} /> : <FontAwesomeIcon icon={faPaperPlane} />}
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
