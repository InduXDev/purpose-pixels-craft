
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  last_message_at: string;
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  loading: boolean;
}

export const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  loading 
}: ConversationListProps) => {
  if (loading) {
    return (
      <div className="w-80 border-r bg-gray-50 p-4">
        <div className="text-center">Loading conversations...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-80 border-r bg-gray-50 p-4">
        <div className="text-center text-gray-500">No conversations yet</div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-gray-50">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Messages</h2>
      </div>
      <ScrollArea className="h-full">
        <div className="p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-white transition-colors",
                selectedConversation === conversation.id && "bg-white shadow-sm"
              )}
            >
              <Avatar>
                <AvatarImage src={conversation.otherUser.avatar_url || undefined} />
                <AvatarFallback>
                  {(conversation.otherUser.full_name || conversation.otherUser.username || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm truncate">
                    {conversation.otherUser.full_name || conversation.otherUser.username || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                  </p>
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
