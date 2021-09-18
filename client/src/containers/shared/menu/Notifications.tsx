import React, { FC, useState, useRef, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NotificationIcon from '../../../images/icons/Icon_Notification.svg';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styled from 'styled-components';
import { markNotificationRead } from '../../../api/notifications/mark-notification-read';
import { getMeAction } from '../../../redux/me/get-me';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getNotifications } from '../../../api/notifications/get-notifications';

function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

type APINotification = {
  id: number;
  link: string;
  text: string;
  is_unread: boolean;
};

export const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<APINotification[]>([]);
  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.log(e);
    }
  };

  // on initial mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // every 15 seconds
  useInterval(() => {
    fetchNotifications();
  }, 15000);

  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef(null);
  const hasUnread = notifications.length > 0;
  return hasUnread ? (
    <div
      className="loginLink menu"
      style={{
        // force display on mobile too
        display: 'block',
      }}
    >
      <div ref={anchorEl}>
        <ReactSVG
          src={NotificationIcon}
          title="Notifications"
          style={{ cursor: 'pointer', width: '24px' }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <Menu
        open={isOpen}
        className="menu-box"
        disablePortal
        anchorEl={() => anchorEl.current}
      >
        <div className="menu-list">
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <MenuList>
              <div className="menu-items">
                {notifications.map(({ id, link, text, is_unread }) => (
                  <MenuItem key={id}>
                    <ItemText
                      onClick={async () => {
                        await markNotificationRead(id);
                        window.location.replace(link);
                      }}
                    >
                      {text}
                    </ItemText>
                    <FontAwesomeIcon
                      icon={faTimes}
                      title="Mark as read"
                      onClick={async () => {
                        await markNotificationRead(id);
                        fetchNotifications();
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </MenuItem>
                ))}
              </div>
            </MenuList>
          </ClickAwayListener>
        </div>
      </Menu>
    </div>
  ) : null;
};

const MenuItem = styled.div`
  display: flex;
  margin: 12px;
  align-items: center;
  justify-content: space-between;
  column-gap: 12px;
`;

const ItemText = styled.div`
  cursor: pointer;
  font-family: Courier, 'Courier New', monospace;
  font-size: 12px !important;
  color: black;
`;

export default Notifications;
