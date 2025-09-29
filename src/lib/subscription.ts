import type { Subscription } from "./types";
import { graphql } from "./http";

export async function subscribe(input: {
  blogId: number;
}): Promise<Subscription> {
  // Note: schema expects lowercased createBlogInput
  const MUTATION = `mutation createSubscription($input: createSubscriptionInput!) {
          createSubscription(input: $input) {
              subscription { id }
          }
      }`;
  const result = await graphql<{
    createSubscription: { subscription: Subscription };
  }>(MUTATION, { input });
  return result.createSubscription.subscription;
}

export async function unsubscribe(input: {
  blogId: number;
}): Promise<Subscription> {
  // Note: schema expects lowercased createBlogInput
  const MUTATION = `mutation deleteSubscription($input: deleteSubscriptionInput!) {
            deleteSubscription(input: $input) {
                subscription { _id }
            }
        }`;
  const result = await graphql<{
    deleteSubscription: { subscription: Subscription };
  }>(MUTATION, { input });

  return result.deleteSubscription.subscription;
}
