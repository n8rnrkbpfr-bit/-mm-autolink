const SUPABASE_URL = 'https://ksxzwpygnhgqftioaroe.supabase.co';
const SUPABASE_KEY = 'Sb_publishable_CDe3g2OvMGRKNn9Q-FFK7Q_2-TcZC4n';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    fetchVehicles();
    
    const form = document.getElementById('vehicle-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const vehicleData = {
                vehicle_number: document.getElementById('vehicle-number').value,
                vehicle_model: document.getElementById('vehicle-model').value,
                year: document.getElementById('vehicle-year').value,
                owner: document.getElementById('vehicle-owner').value,
                phone: document.getElementById('phone-number').value,
                price: parseFloat(document.getElementById('price').value) || 0,
                rc_status: document.getElementById('rc-status').value,
                notes: document.getElementById('notes').value,
                type: 'purchase'
            };

            const { data, error } = await supabase.from('vehicles').insert([vehicleData]);
            
            if (error) {
                alert('Error saving vehicle: ' + error.message);
            } else {
                form.reset();
                fetchVehicles();
            }
        });
    }
});

async function fetchVehicles() {
    const { data: vehicles, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching vehicles:', error);
        return;
    }
    
    renderVehicles(vehicles || []);
    updateDashboard(vehicles || []);
}

function renderVehicles(vehicles) {
    const container = document.getElementById('vehicle-list');
    if (!container) return;
    
    container.innerHTML = '';
    vehicles.forEach(v => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <h3>${v.vehicle_number} - ${v.vehicle_model}</h3>
            <p><strong>Year:</strong> ${v.year} | <strong>Owner:</strong> ${v.owner}</p>
            <p><strong>Phone:</strong> ${v.phone}</p>
            <p><strong>Price:</strong> ₹${v.price}</p>
            <p><strong>RC Status:</strong> ${v.rc_status}</p>
            <p><strong>Notes:</strong> ${v.notes || 'N/A'}</p>
            <button onclick="deleteVehicle('${v.id}')">Delete</button>
        `;
        container.appendChild(card);
    });
}

function updateDashboard(vehicles) {
    const totalVehicles = document.getElementById('total-vehicles');
    const totalPurchases = document.getElementById('total-purchases');
    
    if (totalVehicles) totalVehicles.textContent = vehicles.length;
    if (totalPurchases) {
        const totalSum = vehicles.reduce((sum, v) => sum + (Number(v.price) || 0), 0);
        totalPurchases.textContent = '₹' + totalSum.toLocaleString('en-IN');
    }
}

async function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (error) {
            alert('Error deleting: ' + error.message);
        } else {
            fetchVehicles();
        }
    }
}
