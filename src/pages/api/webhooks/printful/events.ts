type EventMaps = {
  [key: string]: any;
};
export const PrintFulEvents: EventMaps = {
  order_created: (event: any) => {
    console.log("order_created event received ", JSON.stringify(event));
  },
  order_updated: (event: any) => {
    console.log("order_updated event received ", JSON.stringify(event));
  },
  order_failed: (event: any) => {
    console.log("order_failed event received ", JSON.stringify(event));
  },
  order_canceled: (event: any) => {
    console.log("order_canceled event received ", JSON.stringify(event));
  },
  order_put_hold: (event: any) => {
    console.log("order_put_hold event received ", JSON.stringify(event));
  },
  order_put_hold_approval: (event: any) => {
    console.log("order_put_hold_approval event received ", JSON.stringify(event));
  },
  order_remove_hold: (event: any) => {
    console.log("order_remove_hold event received ", JSON.stringify(event));
  },
  package_shipped: (event: any) => {
    console.log("package_shipped event received ", JSON.stringify(event));
  },
  package_returned: (event: any) => {
    console.log("package_returned event received ", JSON.stringify(event));
  },
  product_synced: (event: any) => {
    console.log("product_synced event received ", JSON.stringify(event));
  },
};
