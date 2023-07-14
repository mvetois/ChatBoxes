import React, { useState } from "react";
import "./Main.scss";

import ChatBox from "../ChatBox";

export interface IMessageData {
    user: string;
    id: number;
    text: string;
    timestamp: number;
    updated: boolean;
}

const Main = () => {
    const [messageData, setMessageData] = useState<IMessageData[]>([]);
    const users = ["Bob", "Théo", "Alice"];
    return (
        <div className="Main">
            {users.map((user) => (
                <ChatBox messages={messageData} setMessages={setMessageData} user={user} users={users} key={user}/>
            ))}
        </div>
    );
}

export default Main;