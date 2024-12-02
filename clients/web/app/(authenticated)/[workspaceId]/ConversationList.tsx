import { Button } from "@/components/ui/button";
import { getConversations, searchConversations } from "@/lib/conversations";
import { ConversationModel } from "@/lib/sesameApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import ConversationListItem from "./ConversationListItem";

interface Props {
  conversations: ConversationModel[];
  isSearch?: boolean;
  onClick: () => void;
  onResetSearch?: () => void;
  searchQuery?: string;
  workspaceId: string;
}

const ConversationList = ({
  conversations: initialConversations,
  isSearch,
  onClick,
  onResetSearch,
  searchQuery,
  workspaceId,
}: Props) => {
  const loadingRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ["conversations", workspaceId, searchQuery, initialConversations],
    initialData: isSearch
      ? {
          pages: [],
          pageParams: [],
        }
      : {
          pages: [initialConversations],
          pageParams: [0],
        },
    initialPageParam: 0,
    getNextPageParam: (lastPage = [], _allPages, lastPageParam) => {
      if (lastPage.length < 20) return undefined;
      return lastPageParam + 1;
    },
    queryFn: async ({ pageParam }) => {
      if (isSearch && searchQuery)
        return await searchConversations(workspaceId, searchQuery, pageParam);
      return await getConversations(workspaceId, pageParam);
    },
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isFetching || !loadingRef.current) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isFetching) {
          fetchNextPage();
        }
      });
    });
    intersectionObserver.observe(loadingRef.current);
    return () => {
      intersectionObserver.disconnect();
    };
  }, [fetchNextPage, isFetching]);

  const conversations = data.pages.reduce((arr, page) => [...arr, ...page], []);

  // Helper function to format conversation dates
  const formatDateGroup = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  // Helper function to check if two dates are on the same day
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const groupedConversations = conversations.reduce(
    (acc: Record<string, ConversationModel[]>, conversation) => {
      const group = formatDateGroup(new Date(conversation.updated_at));
      if (!acc[group]) acc[group] = [];
      acc[group].push(conversation);
      return acc;
    },
    {},
  );

  const hasConversations = Object.keys(groupedConversations).length > 0;

  return hasConversations ? (
    <>
      {Object.keys(groupedConversations).map((group) => (
        <div key={group}>
          {/* Group header */}
          <h3 className="text-xs font-bold mb-2 ml-3 text-secondary-foreground">
            {group}
          </h3>

          <ul className="space-y-2">
            {groupedConversations[group].map((conversation) => (
              <ConversationListItem
                key={conversation.conversation_id}
                conversation={conversation}
                onClick={onClick}
                workspaceId={workspaceId}
              />
            ))}
          </ul>
        </div>
      ))}

      {hasNextPage && (
        <div ref={loadingRef} className="flex items-center justify-center">
          <LoaderCircleIcon className="animate-spin" size={16} />
        </div>
      )}
    </>
  ) : (
    <>
      <h3 className="text-md font-bold mb-2 text-secondary-foreground">
        No conversations
      </h3>
      {isSearch && (
        <Button onClick={onResetSearch} variant="outline">
          Reset search query
        </Button>
      )}
    </>
  );
};

export default ConversationList;
