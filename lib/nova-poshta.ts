const API_KEY = process.env.NOVA_POSHTA_API_KEY!;
const API_URL = process.env.NOVA_POSHTA_API_URL || 'https://api.novaposhta.ua/v2.0/json/';
const SENDER_REF = process.env.NOVA_POSHTA_SENDER_REF!;
const CONTACT_REF = process.env.NOVA_POSHTA_SENDER_CONTACT_REF!;
const ADDRESS_REF = process.env.NOVA_POSHTA_SENDER_ADDRESS_REF!;

async function npCall(modelName: string, calledMethod: string, methodProperties: any = {}) {
    const payload = {
        apiKey: API_KEY,
        modelName,
        calledMethod,
        methodProperties
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(`NP Error: ${data.errors?.join(', ')}`);
    }
    return data;
}

export async function searchCities(query: string) {
    return npCall('Address', 'getCities', { FindByString: query, Limit: 20 });
}

export async function searchWarehouses(cityRef: string) {
    return npCall('Address', 'getWarehouses', { CityRef: cityRef });
}

export interface TTNParams {
    orderId: string;
    recipientName: string; // "Іван Іванов"
    recipientPhone: string; // "+380501234567"
    cityRef: string;
    warehouseRef: string;
    weightKg: number;
    declaredCostUah: number;
}

export async function createTTN(params: TTNParams) {
    // First, create the recipient contact person
    const [lastName, firstName, middleName] = params.recipientName.split(' ');

    const rcptRes = await npCall('ContactPerson', 'save', {
        FirstName: firstName || params.recipientName,
        LastName: lastName || 'Клієнт',
        MiddleName: middleName || '',
        Phone: params.recipientPhone
    });
    const recipientContactRef = rcptRes.data[0].Ref;
    const recipientRef = rcptRes.data[0].ContactPerson_id; // Counterparty ref

    // Then create the TTN
    const ttnProps = {
        PayerType: "Recipient",
        PaymentMethod: "Cash",
        DateTime: new Date().toLocaleDateString('uk-UA').split('.').join('.'),
        CargoType: "Cargo",
        VolumeGeneral: "0.001",
        Weight: params.weightKg.toString(),
        ServiceType: "WarehouseWarehouse", // or WarehouseDoors
        SeatsAmount: "1",
        Description: `Замовлення #${params.orderId.substring(0, 8)}`,
        Cost: params.declaredCostUah.toString(),

        // Sender (us)
        CitySender: "YOUR_CITY_REF", // Should be in env for fully dynamic
        Sender: SENDER_REF,
        SenderAddress: ADDRESS_REF,
        ContactSender: CONTACT_REF,
        SendersPhone: "YOUR_PHONE",

        // Recipient (them)
        CityRecipient: params.cityRef,
        Recipient: recipientRef,
        RecipientAddress: params.warehouseRef,
        ContactRecipient: recipientContactRef,
        RecipientsPhone: params.recipientPhone,
    };

    return npCall('InternetDocument', 'save', ttnProps);
}
