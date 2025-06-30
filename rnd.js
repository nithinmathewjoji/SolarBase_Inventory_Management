const COLLECTION_NAME = 'rnd_inventory';
// Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyCVlOYKZ4pSBJDdnVIUTJlcTFbnOSbOumY",
    authDomain: "solarbase-inventory-management.firebaseapp.com",
    projectId: "solarbase-inventory-management",
    storageBucket: "solarbase-inventory-management.firebasestorage.app",
    messagingSenderId: "456892746533",
    appId: "1:456892746533:web:a76914804016639dcfa8cc",
    measurementId: "G-34P8J73RLN"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  async function addItem() {
    const item = {
      itemName: document.getElementById('itemName').value,
      quantity: parseInt(document.getElementById('quantity').value),
      category: document.getElementById('category').value,
      location: document.getElementById('location').value,
      minStockAlert: parseInt(document.getElementById('minStock').value),
      dateAdded: new Date()
    };
  
    if (!item.itemName || isNaN(item.quantity)) return alert('Item name and quantity are required.');
  
    await db.collection('rnd_inventory').add(item);
    loadItems();
  }
  
  function itemHTML(doc) {
    const data = doc.data();
    const lowStock = data.quantity <= data.minStockAlert ? 'low-stock' : '';
    return `<div class="inventory-item ${lowStock}">
    <strong>${data.itemName}</strong><br>
    Qty: <input type="number" id="qty-${doc.id}" value="${data.quantity}" style="width: 60px"/> 
    <button onclick="updateItemQuantity('${doc.id}')">Update</button><br>
    Category: ${data.category}<br>
    Location: ${data.location}<br>
    ${lowStock ? '<b>⚠️ Low Stock</b><br>' : ''}
    <button onclick="deleteItem('${doc.id}')">Delete</button>
  </div>`;
  }
  
  async function loadItems() {
    const snapshot = await db.collection('rnd_inventory').get();
    const list = document.getElementById('inventoryList');
    list.innerHTML = '';
    snapshot.forEach(doc => list.innerHTML += itemHTML(doc));
  }
  
  async function deleteItem(id) {
    await db.collection('rnd_inventory').doc(id).delete();
    loadItems();
  }
  
  function filterItems() {
    const search = document.getElementById('search').value.toLowerCase();
    const items = document.getElementsByClassName('inventory-item');
    Array.from(items).forEach(item => {
      item.style.display = item.innerText.toLowerCase().includes(search) ? '' : 'none';
    });
  }
  
  async function updateItemQuantity(id) {
    const newQty = parseInt(document.getElementById(`qty-${id}`).value);
    if (isNaN(newQty)) return alert("Enter a valid number");
  
    await db.collection('rnd_inventory').doc(id).update({
      quantity: newQty
    });
    loadItems();
  }
  
  loadItems();
  