import { type NextApiRequest, NextApiResponse } from "next";
import { PrintFulEvents } from "./Events";

export default async function StripeWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  debugger;
  const payload = await req.body;

  const event = payload.type;
  const eventHandler = PrintFulEvents[event];
  if (!!eventHandler) {
    eventHandler(payload);
  } else {
    console.error(`Event received ${event} but not implemented`);
  }

  res.status(200).end();
}
