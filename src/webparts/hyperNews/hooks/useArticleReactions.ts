import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperPermissions } from "../../../common/services/HyperPermissions";
import type { INewsReaction, ReactionType } from "../models";

export interface UseArticleReactionsOptions {
  articleId: number;
  listName: string;
  enabled: boolean;
}

export interface UseArticleReactionsResult {
  reactions: INewsReaction[];
  loading: boolean;
  error: Error | undefined;
  addReaction: (type: ReactionType) => Promise<void>;
  removeReaction: (reactionId: number) => Promise<void>;
  currentUserReaction: INewsReaction | undefined;
}

export function useArticleReactions(
  options: UseArticleReactionsOptions
): UseArticleReactionsResult {
  const { articleId, listName, enabled } = options;

  const [reactions, setReactions] = useState<INewsReaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const currentUserId = enabled ? hyperPermissions.getCurrentUserId() : 0;

  // Find current user's reaction
  let currentUserReaction: INewsReaction | undefined;
  reactions.forEach((r) => {
    if (r.UserId === currentUserId) {
      currentUserReaction = r;
    }
  });

  // Fetch reactions for this article
  useEffect(() => {
    if (!enabled || !articleId || !listName) return;

    let cancelled = false;
    setLoading(true);
    setError(undefined);

    const fetchReactions = async (): Promise<void> => {
      try {
        const sp = getSP();
        const items = await sp.web.lists
          .getByTitle(listName)
          .items.filter("ArticleId eq " + articleId)
          .select("Id", "ArticleId", "UserId", "UserName", "ReactionType", "Created")();

        if (!cancelled) {
          setReactions(items as INewsReaction[]);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    fetchReactions().catch(() => {
      /* errors handled above */
    });

    return () => {
      cancelled = true;
    };
  }, [articleId, listName, enabled]);

  const addReaction = useCallback(
    async (type: ReactionType): Promise<void> => {
      if (!enabled) return;
      try {
        const sp = getSP();
        const userName = hyperPermissions.getCurrentUserLoginName();

        // If user already reacted, remove old reaction first
        if (currentUserReaction && currentUserReaction.Id) {
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(currentUserReaction.Id)
            .delete();
          setReactions((prev) =>
            prev.filter((r) => r.Id !== (currentUserReaction as INewsReaction).Id)
          );
        }

        const result = await sp.web.lists.getByTitle(listName).items.add({
          ArticleId: articleId,
          UserId: currentUserId,
          UserName: userName,
          ReactionType: type,
        });

        const newReaction: INewsReaction = {
          Id: result.data.Id as number,
          ArticleId: articleId,
          UserId: currentUserId,
          UserName: userName,
          ReactionType: type,
          Created: result.data.Created as string,
        };

        setReactions((prev) => prev.concat([newReaction]));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [articleId, listName, currentUserId, currentUserReaction, enabled]
  );

  const removeReaction = useCallback(
    async (reactionId: number): Promise<void> => {
      if (!enabled) return;
      try {
        const sp = getSP();
        await sp.web.lists.getByTitle(listName).items.getById(reactionId).delete();
        setReactions((prev) => prev.filter((r) => r.Id !== reactionId));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [listName, enabled]
  );

  return { reactions, loading, error, addReaction, removeReaction, currentUserReaction };
}
