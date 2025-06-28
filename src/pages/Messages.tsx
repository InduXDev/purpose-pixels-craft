
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  otherUser: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (conversationsData && conversationsData.length > 0) {
        const otherUserIds = conversationsData.map(conv => 
          conv.user1_id === user?.id ? conv.user2_id : conv.user1_id
        );

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', otherUserIds);

        if (profilesError) throw profilesError;

        const conversationsWithUsers = conversationsData.map(conv => ({
          ...conv,
          otherUser: profilesData?.find(profile => 
            profile.id === (conv.user1_id === user?.id ? conv.user2_id : conv.user1_id)
          ) || { id: '', full_name: null, username: null, avatar_url: null }
        }));

        setConversations(conversationsWithUsers);
      }
    } catch (error: any) {
      toast({
        title: "Error loading conversations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <MessageSquare className="w-5 h-5" />
          <h1 className="text-xl font-semibold">Direct Messages</h1>
        </div>
        <div className="flex h-[calc(100vh-4rem)]">
          <ConversationList 
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            loading={loading}
          />
          <ChatWindow 
            conversationId={selectedConversation}
            conversations={conversations}
            onConversationUpdate={fetchConversations}
          />
        </div>
      </SidebarInset>
    </div>
  );
};

export default Messages;
