import { gql } from "urql";
import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { PaymentListGateways } from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";

/**
 * Example payload of the webhook. It will be transformed with graphql-codegen to Typescript type: OrderCreatedWebhookPayloadFragment
 */
const NowAvailablePaymentGatewaysWebhookPayload = gql`
  fragment NowAvailablePaymentGatewaysWebhookPayload on PaymentListGateways {
    checkout {
      id
      token
    }
  }
`;

/**
 * Top-level webhook subscription query, that will be attached to the Manifest.
 * Saleor will use it to register webhook.
 */
const graphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${NowAvailablePaymentGatewaysWebhookPayload}
  subscription NowPaymentListGateways {
    event {
      ...NowAvailablePaymentGatewaysWebhookPayload
    }
  }
`;

/**
 * Create abstract Webhook. It decorates handler and performs security checks under the hood.
 *
 * orderCreatedWebhook.getWebhookManifest() must be called in api/manifest too!
 */
export const saleorSyncWebhook = new SaleorSyncWebhook<PaymentListGateways>({
  name: "Custom payment methods",
  webhookPath: "/api/webhooks/payment-list",
  isActive: true,
  event: "PAYMENT_LIST_GATEWAYS" as any,
  apl: saleorApp.apl,
  query: graphqlSubscription,
  onError(error) {
    console.error(error);
    return error;
  },
  async formatErrorResponse(error, req, res) {
    console.error(`There was an error`);
    return {
      code: 400,
      body: error.message,
    };
  },
});

/**
 * Export decorated Next.js handler, which adds extra context
 */
export default saleorSyncWebhook.createHandler((req, res, context) => {
  console.warn(`THIS HAS BEEN CALLED!`, req.body, context.payload);
  return res.status(200).send(
    context.buildResponse([
      {
        name: "Now",
        id: "cnm.payments.now",
        config: [
          {
            field: "store_customer_card",
            value: "false",
          },
        ],
        currencies: ["USD", "PLN"],
      },
    ] as any)
  );
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
