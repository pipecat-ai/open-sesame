import { memo } from "react";
import ConversationList from "./ConversationList";

interface Props {
  onClick: () => void;
  onReset: () => void;
  query: string;
  workspaceId: string;
}

const SearchResults = memo(
  ({ onClick, onReset, query, workspaceId }: Props) => {
    return (
      <ConversationList
        conversations={[]}
        isSearch
        onClick={onClick}
        onResetSearch={onReset}
        searchQuery={query}
        workspaceId={workspaceId}
      />
    );
  },
);
SearchResults.displayName = "SearchResults";

export default SearchResults;
