// Delhivery Express (B2C) API client.
// Docs: https://delhivery-express-api-doc.readme.io
//
// IMPORTANT: Delhivery's mandatory fields can vary slightly by account/contract
// (e.g. some accounts require seller_gst_tin / hsn_code). If a shipment creation
// call fails with a validation error, check the exact required fields for your
// account in the Delhivery One developer portal (https://ucp.delhivery.com) and
// adjust the payload in createShipment() below accordingly.

const DELHIVERY_BASE_URL = 'https://track.delhivery.com';

interface DelhiveryCredentials {
  apiKey: string;
  clientName: string;
  pickupName: string;
  pickupAddress: string;
  pickupCity: string;
  pickupPincode: string;
  pickupPhone: string;
}

interface ShipmentInput {
  orderId: string;
  waybill?: string; // if omitted, Delhivery auto-generates one
  customerName: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  paymentMode: 'COD' | 'Prepaid';
  codAmount: number;
  totalAmount: number;
  productsDesc: string;
  quantity: number;
}

// 1. Fetch a single waybill number to use for a shipment (optional — Delhivery can also auto-generate one)
export async function fetchWaybill(creds: DelhiveryCredentials): Promise<string> {
  const res = await fetch(
    `${DELHIVERY_BASE_URL}/waybill/api/fetch/json/?cl=${encodeURIComponent(creds.clientName)}`,
    {
      headers: { Authorization: `Token ${creds.apiKey}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delhivery fetch-waybill failed (${res.status}): ${text}`);
  }

  const waybill = (await res.text()).trim();
  if (!waybill) throw new Error('Delhivery returned an empty waybill.');
  return waybill;
}

// 2. Create (manifest) a shipment
export async function createShipment(creds: DelhiveryCredentials, order: ShipmentInput) {
  const payload = {
    shipments: [
      {
        name: order.customerName,
        add: `${order.addressLine1}${order.addressLine2 ? ', ' + order.addressLine2 : ''}`,
        pin: order.pincode,
        city: order.city,
        state: order.state,
        country: 'India',
        phone: order.customerPhone,
        order: order.orderId,
        payment_mode: order.paymentMode,
        products_desc: order.productsDesc,
        cod_amount: order.paymentMode === 'COD' ? String(order.codAmount) : '0',
        total_amount: String(order.totalAmount),
        quantity: String(order.quantity),
        waybill: order.waybill ?? '',
        shipping_mode: 'Surface',
        address_type: 'home',
      },
    ],
    pickup_location: {
      name: creds.pickupName,
      add: creds.pickupAddress,
      city: creds.pickupCity,
      pin_code: creds.pickupPincode,
      country: 'India',
      phone: creds.pickupPhone,
    },
  };

  const body = `format=json&data=${JSON.stringify(payload)}`;

  const res = await fetch(`${DELHIVERY_BASE_URL}/api/cmu/create.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Token ${creds.apiKey}`,
    },
    body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    const reason = data?.rmk || data?.error || JSON.stringify(data) || `HTTP ${res.status}`;
    throw new Error(`Delhivery shipment creation failed: ${reason}`);
  }

  const packageResult = data.packages?.[0];
  if (!packageResult?.waybill) {
    throw new Error('Delhivery did not return a waybill number.');
  }

  return {
    waybill: packageResult.waybill as string,
    trackingUrl: `https://www.delhivery.com/track-v2/package/${packageResult.waybill}`,
    raw: data,
  };
}

// 3. Track a shipment by waybill number
export async function trackShipment(apiKey: string, waybill: string) {
  const res = await fetch(
    `${DELHIVERY_BASE_URL}/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}&verbose=1`,
    {
      headers: { Authorization: `Token ${apiKey}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delhivery tracking failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const shipment = data?.ShipmentData?.[0]?.Shipment;
  if (!shipment) throw new Error('No tracking data found for this waybill.');

  return {
    status: shipment.Status?.Status as string | undefined,
    statusDateTime: shipment.Status?.StatusDateTime as string | undefined,
    instructions: shipment.Status?.Instructions as string | undefined,
    raw: data,
  };
}

// Lightweight connectivity check used by the "Test Connection" button in admin settings.
// Fetching a waybill is a safe, side-effect-light way to confirm the API key + client name are valid.
export async function testConnection(creds: DelhiveryCredentials) {
  await fetchWaybill(creds);
  return true;
}
