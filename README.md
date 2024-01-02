# billing-service

A simple billing service using LemonSqueezy.

## API

### GET `/verify`

Verifies if a user has paid/subscribed for a product.

__Query params__

- `email` - The email of the user.
- `productIds` - The product ids to verify.

__Response__

`true | false`

### GET `/products`

Returns a list of products.

__Query params__

- `name` - Filter products by name.

__Response__

```json
[
    {
        "id": "123456",
        "storeId": 12345,
        "type": "directSubscription",
        "prettyPrice": "$1.99"
    },
    {
        "id": "654321",
        "storeId": 12345,
        "type": "oneTime",
        "prettyPrice": "$0.99"
    },
]
```
