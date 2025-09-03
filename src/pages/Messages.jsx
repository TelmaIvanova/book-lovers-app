import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import dayjs from 'dayjs';

export default function MessagesPage() {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user, token } = useAuth();
  const { t } = useTranslation('messages');

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userType = localStorage.getItem('userType');

  const roomId =
    otherUserId && user?._id ? [user._id, otherUserId].sort().join('_') : null;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    socket.emit('joinRoom', roomId);

    socket.off('receiveMessage');

    socket.on('receiveMessage', (msg) => {
      console.log('received socket msg:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [roomId, socket, token]);

  const handleSend = () => {
    if (!newMessage.trim() || !roomId) return;

    const other = conversations.find((c) => c.otherUser.id === otherUserId);

    socket.emit('sendMessage', {
      roomId,
      message: newMessage,
      sender: user._id,
      senderModel: userType === 'ethereum' ? 'EthereumUser' : 'User',
      receiver: otherUserId,
      receiverModel: other?.otherUser?.modelType || 'User',
    });

    setNewMessage('');
  };

  if (!user) {
    return <p>{t('loadingUser')}</p>;
  }

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>

      <div
        style={{
          width: '250px',
          borderRight: '1px solid #ccc',
          padding: '10px',
          overflowY: 'auto',
        }}
      >
        <h5>{t('conversations')}</h5>
        {conversations.map((c, i) => {
          if (!c.otherUser) return null;
          return (
            <div
              key={c.otherUser.id || i}
              style={{
                padding: '8px',
                cursor: 'pointer',
                background:
                  c.otherUser.id === otherUserId ? '#eee' : 'transparent',
              }}
              onClick={() => navigate(`/messages/${c.otherUser.id}`)}
            >
              {c.otherUser.displayName}
              {c.lastMessage && (
                <div style={{ fontSize: '12px', color: '#777' }}>
                  {c.lastMessage.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className='chat-window'>
          {messages.map((m) => {
            const isMine = m.sender.id === user._id;

            // проверка дали е от днес
            const isToday = dayjs(m.createdAt).isSame(dayjs(), 'day');
            const formattedTime = isToday
              ? dayjs(m.createdAt).format('HH:mm')
              : dayjs(m.createdAt).format('DD.MM.YYYY HH:mm');

            return (
              <div
                key={m._id}
                style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '8px 12px',
                    borderRadius: '16px',
                    background: isMine ? '#4ea1ff' : '#2c2c2c',
                    color: isMine ? '#fff' : '#f5f5f5',
                    textAlign: 'left',
                  }}
                >
                  {!isMine && (
                    <div
                      style={{
                        fontSize: '12px',
                        marginBottom: '4px',
                        color: '#bbb',
                      }}
                    >
                      {m.sender.displayName}
                    </div>
                  )}
                  <div>{m.text}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      marginTop: '4px',
                      textAlign: 'right',
                      color: isMine ? '#eaeaea' : '#aaa',
                    }}
                  >
                    {formattedTime}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            padding: '10px',
            borderTop: '1px solid #ccc',
          }}
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('placeholder')}
            style={{ flex: 1, marginRight: '10px' }}
          />
          <button onClick={handleSend} className='btn btn-primary'>
            {t('send')}
          </button>
        </div>
      </div>
    </div>
  );
}
