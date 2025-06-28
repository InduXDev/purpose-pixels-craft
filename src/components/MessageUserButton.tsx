
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

interface MessageUserButtonProps {
  userId: string;
  userName: string;
}

export const MessageUserButton = ({ userId, userName }: MessageUserButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessage = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if conversation already exists
      const { data: existingConversation, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${user.id})`)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      let conversationId = existingConversation?.id;

      if (!conversationId) {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: user.id,
            user2_id: userId
          })
          .select('id')
          .single();

        if (createError) throw createError;
        conversationId = newConversation.id;
      }

      navigate('/messages');
    } catch (error: any) {
      toast({
        title: "Error starting conversation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleMessage}
      disabled={loading}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {loading ? 'Starting...' : `Message ${userName}`}
    </Button>
  );
};
