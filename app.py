from flask import Flask, jsonify, render_template, request
import subprocess
import json

app = Flask(__name__)

# Route principale pour afficher la page
@app.route('/')
def index():
    return render_template('index.html')

# API pour générer une clé
@app.route('/generate-key', methods=['POST'])
def generate_key():
    try:
        result = subprocess.run(
            ['headscale', 'preauthkeys', 'create', '--user', 'up-technologies', '-o', 'json-line'],
            capture_output=True,
            text=True
        )
        return jsonify(json.loads(result.stdout))
    except Exception as e:
        return jsonify({'error': str(e)})

# API pour enregistrer une clé
@app.route('/register-key', methods=['POST'])
def register_key():
    key = request.json.get('key')
    try:
        result = subprocess.run(
            ['headscale', 'nodes', 'register', '--user', 'up-technologies', '--key', key],
            capture_output=True,
            text=True
        )
        return jsonify({'output': result.stdout})
    except Exception as e:
        return jsonify({'error': str(e)})

# API pour afficher la liste des machines
@app.route('/list-nodes', methods=['GET'])
def list_nodes():
    try:
        # Exécuter la commande avec l'option JSON
        result = subprocess.run(
            ['headscale', 'nodes', 'list', '-o', 'json'],
            capture_output=True,
            text=True
        )

        # Si la commande échoue
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 500

        # Charger le JSON et extraire les données nécessaires
        nodes = json.loads(result.stdout)
        filtered_nodes = [
            {
                'id': node['id'],
                'name': node['given_name'],
                'ip_addresses': node['ip_addresses'],
                'connected': node.get('online', False)  # Par défaut, False si "online" est absent
            }
            for node in nodes
        ]

        return jsonify(filtered_nodes)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API pour supprimer une machine par ID
@app.route('/delete-node', methods=['POST'])
def delete_node():
    node_id = request.json.get('id')
    if not node_id:
        return jsonify({'error': 'ID de la machine manquant'}), 400  # Code erreur 400 si l'ID est absent
    try:
        result = subprocess.run(
            ['headscale', 'nodes', 'delete', '--force','-i', node_id],
            capture_output=True,
            text=True
        )
        if result.returncode != 0:  # Vérifier si la suppression a échoué
            return jsonify({'error': 'Échec de la suppression, vérifiez l\'ID'}), 400
        return jsonify({'output': f'Machine {node_id} supprimée avec succès.'})
    except Exception as e:
        return jsonify({'error': f'Erreur interne: {str(e)}'}), 500

# API pour renommer une machine par ID
@app.route('/rename-node', methods=['POST'])
def rename_node():
    data = request.json
    node_id = data.get('id')
    new_name = data.get('new_name')

    if not node_id or not new_name:
        return jsonify({'error': 'ID et nouveau nom requis'}), 400

    try:
        result = subprocess.run(
            ['headscale', 'nodes', 'rename', new_name, '-i', str(node_id)],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            return jsonify({'error': f'Échec du renommage: {result.stderr}'}), 400

        return jsonify({'message': f'Machine {node_id} renommée en {new_name} avec succès.'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
   app.run(host='0.0.0.0', port=8081)
