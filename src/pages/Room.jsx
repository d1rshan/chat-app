import { useState, useEffect } from "react";
import { conf } from "../conf/conf";
import { databases } from "../appwrite/appwriteConfig";
import { ID, Permission, Query, Role } from "appwrite";
import { Trash2 } from "react-feather";
import client from "../appwrite/appwriteConfig";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const { user } = useAuth();
  // sending a message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };
    let permissions = [Permission.write(Role.user(user.$id))];
    let res = await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      payload,
      permissions
    );
    // setMessages((prevMessages) => [res, ...prevMessages]);
    setMessageBody("");
  };

  const fetchMessages = async () => {
    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.orderDesc("$createdAt")]
      );
      setMessages(res.documents);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async (message_id) => {
    // setMessages((prevMessages) =>
    //   prevMessages.filter((message) => message.$id !== message_id)
    // );
    await databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      message_id
    );
  };
  useEffect(() => {
    fetchMessages();
    const unsubscribe = client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`,
      (response) => {
        // console.log(response);

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("message was created!");
          setMessages((prevMessages) => [response.payload, ...prevMessages]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("message deleted!");
          setMessages((prevMessages) =>
            prevMessages.filter(
              (message) => message.$id !== response.payload.$id
            )
          );
        }
      }
    );
    return () => unsubscribe();
  }, []);
  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength={1000}
              placeholder="Say something..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
            ></textarea>

            <div className="send-btn--wrapper">
              <button className="btn btn--secondary" type="submit">
                Send
              </button>
            </div>
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span>{message.username}</span>
                  ) : (
                    <span>Anonymous user</span>
                  )}
                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>
                {message.user_id === user.$id && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => deleteMessage(message.$id)}
                  />
                )}
              </div>

              <div
                className={`message--body ${
                  message.user_id === user.$id && "message--body--owner"
                }`}
              >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Room;
