
from flask import Flask, jsonify, request

app = Flask(__name__)

# Mock inventory and invoices data
inventory = [
    {"name": "Red Bull", "quantity": 20},
    {"name": "Coca Cola", "quantity": 50},
    {"name": "Jack Daniels", "quantity": 10},
    {"name": "Budvar", "quantity": 30}
]

invoices = [
    {"id": 1, "items": [{"name": "Red Bull", "quantity": 5}], "total": 100},
    {"id": 2, "items": [{"name": "Coca Cola", "quantity": 10}], "total": 200}
]

# Inventory endpoints
@app.route('/inventory', methods=['GET'])
def get_inventory():
    return jsonify(inventory)

@app.route('/inventory', methods=['POST'])
def add_inventory():
    new_item = request.json
    inventory.append(new_item)
    return jsonify({"message": "Item added successfully!"}), 201

@app.route('/inventory/<string:name>', methods=['PUT'])
def update_inventory(name):
    for item in inventory:
        if item["name"] == name:
            item["quantity"] = request.json["quantity"]
            return jsonify({"message": "Item updated successfully!"})
    return jsonify({"message": "Item not found!"}), 404

@app.route('/inventory/<string:name>', methods=['DELETE'])
def delete_inventory(name):
    global inventory
    inventory = [item for item in inventory if item["name"] != name]
    return jsonify({"message": "Item deleted successfully!"})

# Invoice endpoints
@app.route('/invoices', methods=['GET'])
def get_invoices():
    return jsonify(invoices)

@app.route('/invoices', methods=['POST'])
def add_invoice():
    new_invoice = request.json
    invoices.append(new_invoice)
    return jsonify({"message": "Invoice added successfully!"}), 201

@app.route('/invoices/<int:id>', methods=['GET'])
def get_invoice(id):
    for invoice in invoices:
        if invoice["id"] == id:
            return jsonify(invoice)
    return jsonify({"message": "Invoice not found!"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
