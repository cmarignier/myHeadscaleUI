// 📌 Fonction pour lister les machines
async function listNodes() {
  const response = await fetch('/list-nodes');
  const nodes = await response.json();
  
  console.log(nodes); // Debugging console

  const tableBody = document.getElementById('node-table-body');
  if (!tableBody) {
    console.error("Le tbody n'a pas été trouvé !");
    return;
  }

  // Vider le tableau avant d'ajouter les nouvelles données
  tableBody.innerHTML = '';

  nodes.forEach(node => {
    const row = `<tr>
      <td class="border border-gray-300 px-4 py-2">${node.id}</td>
      <td class="border border-gray-300 px-4 py-2">${node.name}</td>
      <td class="border border-gray-300 px-4 py-2">${node.ip_addresses.join(', ')}</td>
      <td class="border border-gray-300 px-4 py-2">${node.connected ? 'Oui' : 'Non'}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

// 📌 Fonction pour supprimer une machine avec confirmation
async function deleteNode() {
  const nodeId = document.getElementById('delete-node-id').value;

  if (!nodeId) {
    Swal.fire({
      icon: 'error',
      title: 'ID manquant',
      text: 'Veuillez entrer un ID de machine à supprimer.',
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    text: `Voulez-vous supprimer la machine ${nodeId} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/delete-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nodeId })
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: data.error || 'Une erreur est survenue lors de la suppression.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Machine supprimée',
          text: data.output || 'La machine a été supprimée avec succès.',
        });
        listNodes();  // Mettre à jour la liste après suppression
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: 'Une erreur est survenue lors de la suppression.',
      });
    }
  }
}

// 📌 Fonction pour renommer une machine
async function renameNode() {
  const nodeId = document.getElementById('rename-node-id').value;
  const newName = document.getElementById('rename-node-name').value;

  if (!nodeId || !newName) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Veuillez entrer un ID et un nouveau nom.',
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Confirmer le renommage',
    text: `Voulez-vous renommer la machine ${nodeId} en ${newName} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, renommer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    const response = await fetch('/rename-node', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: nodeId, new_name: newName })
    });

    const data = await response.json();

    if (data.error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: data.error
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: data.message
      });

      listNodes(); // Mettre à jour la liste après renommage
    }
  }
}

// 📌 Fonction pour générer une clé
async function generateKey() {
  const response = await fetch('/generate-key', { method: 'POST' });
  const data = await response.json();
  document.getElementById('key-output').textContent = data.key || data.error || 'Erreur inconnue';
}

// 📌 Fonction pour enregistrer une clé
async function registerKey() {
  const key = document.getElementById('register-key-input').value;
  const response = await fetch('/register-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  });
  const data = await response.json();
  document.getElementById('register-output').textContent = data.output || data.error || 'Erreur inconnue';
}

// 📌 Charger la liste des machines au démarrage de la page
document.addEventListener('DOMContentLoaded', () => {
  listNodes();
});
