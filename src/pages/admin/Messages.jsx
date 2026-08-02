import { memo } from "react";
import { useSEO } from "../../hooks/useSEO";
import ChatPanel from "../../components/chat/ChatPanel";

const Messages = memo(() => {
  useSEO({
    title: "Messages | Admin",
    description: "Manage conversations with users and clients.",
    keywords: ["messages", "chat", "admin", "conversations"],
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Conversations with users and clients.
        </p>
      </div>
      <ChatPanel role="admin" className="flex-1 min-h-0" />
    </div>
  );
});

Messages.displayName = "AdminMessages";

export default Messages;
