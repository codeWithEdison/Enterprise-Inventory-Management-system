/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/notifications/NotificationsPage.tsx
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { NotificationResponse, NotificationStatus } from '@/types/api/types';
import axiosInstance from '@/lib/axios';
import { 
  Bell, 
  Check,
  Clock,
  Trash2
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | NotificationStatus>('ALL');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<NotificationResponse[]>('/notifications');
        setNotifications(data);
      } catch (error: any) {
        console.error('Failed to fetch notifications:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { data: updatedNotification } = await axiosInstance.patch<NotificationResponse>(`/notifications/${notificationId}/mark-as-read`);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? updatedNotification : notification
        )
      );
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => n.status === NotificationStatus.UNREAD)
          .map(n => axiosInstance.patch(`/notifications/${n.id}/mark-as-read`))
      );
      
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          status: NotificationStatus.READ
        }))
      );
    } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error.message);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || notification.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) return <LoadingScreen />;

  const unreadCount = notifications.filter(n => n.status === NotificationStatus.UNREAD).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notifications`}
      >
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Check className="h-4 w-4" />
            Mark All as Read
          </button>
        )}
      </PageHeader>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search notifications..."
            className="w-96"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as NotificationStatus | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Notifications</option>
            <option value={NotificationStatus.READ}>Read</option>
            <option value={NotificationStatus.UNREAD}>Unread</option>
          </select>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                notification.status === NotificationStatus.UNREAD ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  notification.status === NotificationStatus.UNREAD 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100'
                }`}>
                  <Bell className={`h-5 w-5 ${
                    notification.status === NotificationStatus.UNREAD 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    notification.status === NotificationStatus.UNREAD 
                      ? 'font-medium text-gray-900' 
                      : 'text-gray-600'
                  }`}>
                    {notification.message}
                  </p>
                  <div className="mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {notification.status === NotificationStatus.UNREAD && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Handle delete notification
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;