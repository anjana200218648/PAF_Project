import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthentication } from "../../features/authentication/contexts/AuthenticationContextProvider";
import { INotification } from "../../features/feed/pages/Notifications/Notifications";
import { IConversation } from "../../features/messaging/components/Conversations/Conversations";
import { IConnection } from "../../features/networking/components/Connection/Connection";
import { useWebSocket } from "../../features/ws/WebSocketContextProvider";
import { request } from "../../utils/api";
import classes from "./Header.module.scss";
import { Profile } from "./components/Profile/Profile";
import { Search } from "./components/Search/Search";
export function Header() {
  const { user } = useAuthentication();
  const webSocketClient = useWebSocket();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(
    window.innerWidth > 1080 ? true : false
  );

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const nonReadNotificationCount = notifications.filter(
    (notification) => !notification.read
  ).length;
  const location = useLocation();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const nonReadMessagesCount = conversations.reduce(
    (acc, conversation) =>
      acc +
      conversation.messages.filter((message) => message.sender.id !== user?.id && !message.isRead)
        .length,
    0
  );
  const [invitations, setInvitations] = useState<IConnection[]>([]);
  useEffect(() => {
    const handleResize = () => {
      setShowNavigationMenu(window.innerWidth > 1080);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    request<IConversation[]>({
      endpoint: "/api/v1/messaging/conversations",
      onSuccess: (data) => setConversations(data),
      onFailure: (error) => console.log(error),
    });
  }, [location.pathname]);

  useEffect(() => {
    request<INotification[]>({
      endpoint: "/api/v1/notifications",
      onSuccess: setNotifications,
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      `/topic/users/${user?.id}/conversations`,
      (message) => {
        const conversation = JSON.parse(message.body);
        setConversations((prevConversations) => {
          const index = prevConversations.findIndex((c) => c.id === conversation.id);
          if (index === -1) {
            if (conversation.author.id === user?.id) return prevConversations;
            return [conversation, ...prevConversations];
          }
          return prevConversations.map((c) => (c.id === conversation.id ? conversation : c));
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscribtion = webSocketClient?.subscribe(
      `/topic/users/${user?.id}/notifications`,
      (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => {
          const index = prev.findIndex((n) => n.id === notification.id);
          if (index === -1) {
            return [notification, ...prev];
          }
          return prev.map((n) => (n.id === notification.id ? notification : n));
        });
      }
    );
    return () => subscribtion?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?status=PENDING",
      onSuccess: (data) =>
        setInvitations(data.filter((c) => !c.seen && c.recipient.id === user?.id)),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/new",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((connections) =>
          connection.recipient.id === user?.id ? [connection, ...connections] : connections
        );
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/accepted",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/remove",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/seen",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  return (
    <header className={classes.root}>
      <div className={classes.container}>
        <div className={classes.left}>
       <NavLink to="/">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="600"
    height="400"
    viewBox="0 0 650 400"
  >
    <image
      xlinkHref="data:image/png;base64,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"
      x="0"
      y="0"
      width="600"
      height="400"
    />
  </svg>
</NavLink>


          <Search />
        </div>
        <div className={classes.right}>
          {showNavigationMenu ? (
            <ul className={classes.navigation}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                    focusable="false"
                  >
                    <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                  </svg>
                  <span>Home</span>
                </NavLink>
              </li>
              <li className={classes.network}>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/network"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                  </svg>
                  <div>
                    {invitations.length > 0 && !location.pathname.includes("network") ? (
                      <span className={classes.badge}>{invitations.length}</span>
                    ) : null}
                    <span>Network</span>
                  </div>
                </NavLink>
              </li>
              <li className={classes.messaging}>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/messaging"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                  </svg>
                  <div>
                    {nonReadMessagesCount > 0 && !location.pathname.includes("messaging") ? (
                      <span className={classes.badge}>{nonReadMessagesCount}</span>
                    ) : null}
                    <span>Messaging</span>
                  </div>
                </NavLink>
              </li>
              <li className={classes.notifications}>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/notifications"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                  </svg>
                  <div>
                    {nonReadNotificationCount > 0 ? (
                      <span className={classes.badge}>{nonReadNotificationCount}</span>
                    ) : null}
                    <span>Notications</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          ) : null}

          <button
            className={classes.toggle}
            onClick={() => {
              setShowNavigationMenu((prev) => !prev);
              setShowProfileMenu(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
            </svg>
            <span>Menu</span>
          </button>
          {user ? (
            <Profile
              setShowNavigationMenu={setShowNavigationMenu}
              showProfileMenu={showProfileMenu}
              setShowProfileMenu={setShowProfileMenu}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
