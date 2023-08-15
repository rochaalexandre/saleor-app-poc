import { gql } from "urql";
import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { AvailablePaymentGatewaysWebhookPayloadFragment } from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";
import { createClient } from "../../../lib/create-graphq-client";
import { SyncWebhookEventType } from "@saleor/app-sdk/types";

/**
 * Example payload of the webhook. It will be transformed with graphql-codegen to Typescript type: OrderCreatedWebhookPayloadFragment
 */
const AvailablePaymentGatewaysWebhookPayload = gql`
  fragment AvailablePaymentGatewaysWebhookPayload on CheckoutCreated {
    checkout {
      availablePaymentGateways {
        id
        name
      }
    }
  }
`;

/**
 * Top-level webhook subscription query, that will be attached to the Manifest.
 * Saleor will use it to register webhook.
 */
const graphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${AvailablePaymentGatewaysWebhookPayload}
  subscription CheckoutCreated {
    event {
      ...AvailablePaymentGatewaysWebhookPayload
    }
  }
`;

/**
 * Create abstract Webhook. It decorates handler and performs security checks under the hood.
 *
 * orderCreatedWebhook.getWebhookManifest() must be called in api/manifest too!
 */
export const saleorSyncWebhook =
  new SaleorSyncWebhook<AvailablePaymentGatewaysWebhookPayloadFragment>({
    name: "Custom payment methods",
    webhookPath: "api/webhooks/payment-list",
    isActive: true,
    event: "PAYMENT_LIST_GATEWAYS" as unknown as SyncWebhookEventType,
    apl: saleorApp.apl,
    query: graphqlSubscription,
  });

/**
 * Export decorated Next.js handler, which adds extra context
 */
export default saleorSyncWebhook.createHandler((req, res, ctx) => {
  const {
    /**
     * Access payload from Saleor - defined above
     */
    payload,
    /**
     * Saleor event that triggers the webhook (here - ORDER_CREATED)
     */
    event,
    /**
     * App's URL
     */
    baseUrl,
    /**
     * Auth data (from APL) - contains token and saleorApiUrl that can be used to construct graphQL client
     */
    authData,
  } = ctx;

  let string = payload.checkout?.availablePaymentGateways.join(" | ") || "no option available";
  /**
   * Perform logic based on Saleor Event payload
   */
  console.log(`### Available Payment Gateways for customer: ${string}`);

  /**
   * Create GraphQL client to interact with Saleor API.
   */
  const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

  /**
   * Now you can fetch additional data using urql.
   * https://formidable.com/open-source/urql/docs/api/core/#clientquery
   */

  // const data = await client.query().toPromise()

  /**
   * Inform Saleor that webhook was delivered properly.
   */
  return res.status(200).end();
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
