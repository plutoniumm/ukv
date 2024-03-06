const acc_url = (account_id: string) => `https://api.cloudflare.com/client/v4/accounts/${account_id}`;
const kv_url = (account_id: string, namespace_id: string) => `${acc_url(account_id)}/storage/kv/namespaces/${namespace_id}`;

const options = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer undefined' },
  body: JSON.stringify([{
    "base64": false,
    "expiration": 1578435000,
    "expiration_ttl": 300,
    "key": "My-Key",
    "metadata": { "someMetadataKey": "someMetadataValue" }, "value": "Some string"
  }])
};

fetch('https://api.cloudflare.com/client/v4/accounts/account_id/storage/kv/namespaces/namespace_id/bulk', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));