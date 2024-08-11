'use strict'

// Abrir modal
const openModal = () => {
    document.getElementById('modal').classList.add('active');
    document.getElementById('nome').dataset.index = 'new';
}

// Fechar modal e limpar campos
const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

// Obter e definir localStorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
    updateTable();
}

// UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
    updateTable();
}

// READ
const readClient = () => getLocalStorage()

// CREATE
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
    updateTable();
}

// Validando os campos
const isValidFields = () => document.querySelector('.modal-form').reportValidity()

// Limpar campos do modal
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

// Salvar cliente
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            name: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('celular').value,
            address: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index;
        if (index === 'new') {
            createClient(client);
        } else {
            updateClient(index, client);
        }
        clearFields();
        closeModal();
    }
}

// Atualizar tabela
const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.address}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
    document.querySelector('#tableClient>tbody').appendChild(newRow);
}

// Atualiza a tabela
const updateTable = () => {
    const dbClient = readClient();
    const tableBody = document.querySelector('#tableClient>tbody');
    tableBody.innerHTML = '';
    dbClient.forEach(createRow);
}

// Preenche os campos do modal para edição
const fillFields = (client) => {
    document.getElementById('nome').value = client.name;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.phone;
    document.getElementById('cidade').value = client.address;
    document.getElementById('nome').dataset.index = client.index;
}

// Edita o cliente
const editClient = (index) => {
    const client = readClient()[index];
    client.index = index; // Adiciona o índice ao cliente
    fillFields(client);
    openModal();
}

// Lida com eventos de clique em editar e excluir
const editDelete = (event) => {
    if (event.target.type == 'button') {
        
       const [action, index] = event.target.id.split('-')

       if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient
            const response = confirm ('Deseja realmente excluir o cliente')  
            if (response){

            }
            deleteClient(index)
            updateTable()  
          
        }
    }
}

updateTable();

// Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('salvar').addEventListener('click', saveClient);
document.getElementById('cancelar').addEventListener('click', closeModal);
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);